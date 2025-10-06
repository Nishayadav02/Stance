"use client";
import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/utils/db';
import { ChatHistory } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { ArrowLeft } from 'lucide-react';

function ViewTutorChatPage({ params }) {
    const { user } = useUser();
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && params.chatId) {
            loadChatHistory();
        }
    }, [user, params.chatId]);

    const loadChatHistory = async () => {
        setLoading(true);
        const history = await db.select()
            .from(ChatHistory)
            .where(eq(ChatHistory.chatSessionId, params.chatId));
        
        setChatMessages(history);
        setLoading(false);
    };

    return (
        <div className='p-10'>
            <Link href="/dashboard/tutor/history">
                <Button className="mb-8"><ArrowLeft className="mr-2" /> Back to All Notes</Button>
            </Link>
            <h2 className='font-bold text-3xl mb-8'>Conversation Note</h2>

            <div className="border rounded-lg shadow-sm p-6 bg-white">
                {loading ? <p>Loading history...</p> : (
                    <div className="flex flex-col gap-8">
                        {chatMessages.map((msg, index) => (
                            <div key={index}>
                                <div className='p-4 bg-secondary rounded-lg'>
                                    <p className='font-bold text-lg'>You asked:</p>
                                    <p className='mt-1'>{msg.userInput}</p>
                                </div>
                                <div className='p-4 mt-2 bg-blue-50 border-l-4 border-primary rounded-lg'>
                                    <p className='font-bold text-lg text-primary'>AI Tutor answered:</p>
                                    {/* --- CHANGE YAHAN KIYA GAYA HAI --- */}
                                    <div className='mt-2 whitespace-pre-wrap'>{msg.aiResponse}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewTutorChatPage;