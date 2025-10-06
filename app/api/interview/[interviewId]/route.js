import { db } from "@/utils/db";
import { Stance, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { interviewId } = params;

    if (!interviewId) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    // Delete associated answers first
    await db.delete(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId));

    // Delete the main interview record
    await db.delete(Stance)
      .where(eq(Stance.mockId, interviewId));

    return NextResponse.json({ success: true, message: "Interview deleted successfully" });

  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { error: "Failed to delete interview." },
      { status: 500 }
    );
  }
}