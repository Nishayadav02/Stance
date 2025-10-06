// import { db } from "@/utils/db";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { UserAnswer } from "@/utils/schema";
// import moment from "moment";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const {
//       mockId,
//       question,
//       correctAns,
//       userAns,
//       userEmail,
//     } = await request.json();

//     const feedbackPrompt = `Question: ${question}, User Answer: ${userAns}. Based on this, please provide a rating for the answer and feedback for improvement in just 3-5 lines. Format the output as a JSON object with only a "rating" field and a "feedback" field.`;

//     const result = await chatSession.sendMessage(feedbackPrompt);
//     let mockJsonResponse = await result.response.text();

//     mockJsonResponse = mockJsonResponse.replace(/```json/g, "").replace(/```/g, "").trim();
//     const jsonFeedbackResponse = JSON.parse(mockJsonResponse);

//     const resp = await db.insert(UserAnswer).values({
//       mockIdRef: mockId,
//       question: question,
//       correctAns: correctAns,
//       userAns: userAns,
//       feedback: jsonFeedbackResponse.feedback,
//       rating: jsonFeedbackResponse.rating,
//       userEmail: userEmail,
//       createdAt: moment().format("DD-MM-yyyy"),
//     });

//     return NextResponse.json({ success: true, response: resp }, { status: 201 });

//   } catch (error) {
//     console.error("Error generating feedback:", error);
//     return NextResponse.json(
//       { error: "Failed to generate or save feedback.", details: error.message },
//       { status: 500 }
//     );
//   }
// }



// import { db } from "@/utils/db";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { UserAnswer } from "@/utils/schema";
// import moment from "moment";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const {
//       mockId,
//       question,
//       correctAns,
//       userAns,
//       userEmail,
//     } = await request.json();

//     // The duration of the user's answer in seconds (we will need to add this from the frontend later)
//     const recordingDuration = 30; // Assuming a 30-second answer for now

//     // --- NEW, ADVANCED PROMPT ---
//     const feedbackPrompt = `
//       Analyze the following interview response based on the question provided.
//       Question: "${question}"
//       User's Answer: "${userAns}"
//       Correct Answer for reference: "${correctAns}"

//       Please provide a detailed analysis in a valid JSON format. The JSON object must include these exact fields:
//       1.  "rating": A numerical rating of the user's answer out of 10.
//       2.  "feedback": A concise paragraph of feedback on the answer's quality and areas for improvement.
//       3.  "fillerWordCount": An estimated integer count of common filler words like "um", "ah", "like".
//       4.  "sentiment": A single word describing the tone of the answer (e.g., "Confident", "Nervous", "Informative").
//     `;

//     const result = await chatSession.sendMessage(feedbackPrompt);
//     let mockJsonResponse = await result.response.text();

//     mockJsonResponse = mockJsonResponse.replace(/```json/g, "").replace(/```/g, "").trim();
//     const jsonFeedbackResponse = JSON.parse(mockJsonResponse);
    
//     // Calculate Speaking Pace (Words Per Minute)
//     const wordsInAnswer = userAns.trim().split(/\s+/).length;
//     const wordsPerMinute = Math.round((wordsInAnswer / recordingDuration) * 60);

//     // Insert all data, including new metrics, into the database
//     const resp = await db.insert(UserAnswer).values({
//       mockIdRef: mockId,
//       question: question,
//       correctAns: correctAns,
//       userAns: userAns,
//       feedback: jsonFeedbackResponse.feedback,
//       rating: jsonFeedbackResponse.rating,
//       userEmail: userEmail,
//       createdAt: moment().format("DD-MM-yyyy"),
//       // --- SAVING NEW METRICS ---
//       fillerWordCount: jsonFeedbackResponse.fillerWordCount,
//       speakingPace: wordsPerMinute,
//       sentiment: jsonFeedbackResponse.sentiment,
//     });

//     return NextResponse.json({ success: true }, { status: 201 });

//   } catch (error) {
//     console.error("Error generating feedback:", error);
//     return NextResponse.json(
//       { error: "Failed to generate or save feedback." },
//       { status: 500 }
//     );
//   }
// }

import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAIModel";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      mockId,
      question,
      correctAns,
      userAns,
      userEmail,
    } = await request.json();

    // Fix: Add a check to ensure userAns is not empty or null
    if (!userAns) {
        return NextResponse.json({ error: "User answer cannot be empty." }, { status: 400 });
    }

    const recordingDuration = 30; // Assuming a 30-second answer for now

    const feedbackPrompt = `
      Analyze the following interview response based on the question provided.
      Question: "${question}"
      User's Answer: "${userAns}"
      Correct Answer for reference: "${correctAns}"

      Please provide a detailed analysis in a valid JSON format. The JSON object must include these exact fields:
      1.  "rating": A numerical rating of the user's answer out of 10.
      2.  "feedback": A concise paragraph of feedback on the answer's quality and areas for improvement.
      3.  "fillerWordCount": An estimated integer count of common filler words like "um", "ah", "like".
      4.  "sentiment": A single word describing the tone of the answer (e.g., "Confident", "Nervous", "Informative").
    `;

    const result = await chatSession.sendMessage(feedbackPrompt);
    let mockJsonResponse = await result.response.text();

    mockJsonResponse = mockJsonResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonFeedbackResponse = JSON.parse(mockJsonResponse);
    
    const wordsInAnswer = userAns.trim().split(/\s+/).length;
    const wordsPerMinute = Math.round((wordsInAnswer / recordingDuration) * 60);

    await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      question: question,
      correctAns: correctAns,
      userAns: userAns,
      feedback: jsonFeedbackResponse.feedback,
      rating: jsonFeedbackResponse.rating,
      userEmail: userEmail,
      createdAt: moment().format("DD-MM-yyyy"),
      fillerWordCount: jsonFeedbackResponse.fillerWordCount,
      speakingPace: wordsPerMinute,
      sentiment: jsonFeedbackResponse.sentiment,
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate or save feedback." },
      { status: 500 }
    );
  } 
}