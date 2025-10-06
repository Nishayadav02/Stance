import { pgTable, serial, text, varchar, integer } from "drizzle-orm/pg-core";

export const Stance = pgTable('prepGenie', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
});

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt'),

    // --- NEW COLUMNS ADDED HERE ---
    fillerWordCount: integer('filler_word_count'),
    speakingPace: integer('speaking_pace'),
    sentiment: varchar('sentiment'),
});

export const ChatHistory = pgTable('chatHistory', {
    id: serial('id').primaryKey(),
    chatSessionId: varchar('chatSessionId').notNull(),
    title: varchar('title'), // <-- Yeh nayi line
    userEmail: varchar('userEmail').notNull(),
    userInput: text('userInput').notNull(),
    aiResponse: text('aiResponse').notNull(),
    createdAt: varchar('createdAt').notNull(),
});