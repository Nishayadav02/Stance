import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { Stance } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(request) {
  try {
    const { jobPosition, jobDesc, jobExperience, userEmail } = await request.json();

    const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of experience: ${jobExperience}. Please provide me 5 interview questions along with answers in JSON format. Give us "question" and "answer" fields in each JSON object.`;

    // Call the Google Gemini AI
    const result = await chatSession.sendMessage(InputPrompt);
    let mockJsonResponse = await result.response.text();
    
    // Clean the AI response
    mockJsonResponse = mockJsonResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    // Ensure the response is not empty
    if (!mockJsonResponse) {
        throw new Error("Received an empty response from the AI.");
    }
    
    // This is a critical security and stability step.
    // We try to parse the JSON to make sure it's valid before saving.
    JSON.parse(mockJsonResponse); 

    // Insert into the database
    const resp = await db
      .insert(Stance)
      .values({
        mockId: uuidv4(),
        jsonMockResp: mockJsonResponse,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: userEmail,
        createdAt: moment().format("DD-MM-yyyy"),
      })
      .returning({ mockId: Stance.mockId });

    return NextResponse.json({ mockId: resp[0]?.mockId });

  } catch (error) {
    console.error("Error in generate-interview API:", error);
    // Return a more detailed error for debugging
    return NextResponse.json(
        { error: "Failed to generate interview", details: error.message },
        { status: 500 }
    );
  }
}