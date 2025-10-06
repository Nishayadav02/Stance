"use client";
import Link from 'next/link';
import { Bot, BookOpen } from 'lucide-react';

function AiTutorDashboard() {
    return (
        <div className='p-10'>
            {/* --- Welcome Header --- */}
            <div className='text-center mb-12'>
                <h1 className='text-4xl font-bold text-indigo-700'>Welcome to Your Study Space</h1>
                <p className='text-lg text-gray-500 mt-2'>Your personal AI Tutor is here to help you understand complex topics.</p>
            </div>

            {/* --- Cards Section --- */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto'>
                {/* 1. Start New Chat Card */}
                <Link href="/dashboard/tutor/new">
                    <div className='group p-8 border rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center'>
                        <Bot className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                        <h2 className='text-2xl font-semibold mt-4'>Start a New Chat</h2>
                        <p className='text-gray-500 mt-2'>Have a question? Start a new session with your AI Tutor to get instant explanations.</p>
                    </div>
                </Link>

                {/* 2. Review Past Sessions Card */}
                <Link href="/dashboard/tutor/history">
                    <div className='group p-8 border rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center'>
                        <BookOpen className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                        <h2 className='text-2xl font-semibold mt-4'>Review Past Sessions</h2>
                        <p className='text-gray-500 mt-2'>Look through your saved conversations and notes from previous study sessions.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default AiTutorDashboard;