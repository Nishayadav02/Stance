import { db } from "@/utils/db";
import { ChatHistory } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { chatId } = params;

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    await db.delete(ChatHistory)
      .where(eq(ChatHistory.chatSessionId, chatId));

    return NextResponse.json({ success: true, message: "Chat deleted successfully" });

  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat history." },
      { status: 500 }
    );
  }
}