import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { ChatHistory } from "@/utils/schema";
import moment from "moment";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    let { question, userEmail, chatSessionId } = await request.json();

    if (!chatSessionId) {
        chatSessionId = uuidv4();
    }

    // --- NEW, MORE SPECIFIC PROMPT ---
    const prompt = `
      You are "Stance", a helpful and knowledgeable AI assistant. Your tone should be natural, friendly, and conversational.
      A user has asked: "${question}".

      **Your Task:**
      1.  If the user's input is a simple greeting (like "hi", "hello"), respond with a short, friendly greeting and ask how you can help.
      2.  If the user's input is a question, provide a clear and helpful response.
      
      **Formatting Rules:**
      - Write your entire response in clear, easy-to-read paragraphs.
      - **Do not use any markdown formatting.** Specifically, do not use asterisks for bolding (**text**).
    `;

    const result = await chatSession.sendMessage(prompt);
    let aiResponseText = await result.response.text();

    // The logic to extract the title and answer remains the same
    let title = "Chat Session";
    let answer = aiResponseText;

    if (aiResponseText.includes('[')) {
        const titleMatch = aiResponseText.match(/\[(.*?)\]/);
        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1];
            answer = aiResponseText.replace(/\[(.*?)\]/, '').trim();
        }
    }

    await db.insert(ChatHistory).values({
      chatSessionId: chatSessionId,
      title: title,
      userInput: question,
      aiResponse: answer,
      userEmail: userEmail,
      createdAt: moment().format("DD-MM-yyyy"),
    });

    return NextResponse.json({ answer: answer, chatSessionId: chatSessionId });

  } catch (error) {
    console.error("Error in AI Tutor API:", error);
    return NextResponse.json(
      { error: "Failed to get an answer from the AI assistant." },
      { status: 500 }
    );
  }
}