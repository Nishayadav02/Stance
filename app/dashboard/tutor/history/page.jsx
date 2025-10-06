"use client";
import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/utils/db';
import { ChatHistory } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { ArrowLeft, MessageSquare, Eye, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';


function ChatHistoryPage() {
    const { user } = useUser();
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadChatHistory();
        }
    }, [user]);

    const loadChatHistory = async () => {
        setLoading(true);
        if (!user) return;

        const allChats = await db.select()
            .from(ChatHistory)
            .where(eq(ChatHistory.userEmail, user.primaryEmailAddress.emailAddress))
            .orderBy(desc(ChatHistory.id));
        
        const uniqueChats = [];
        const seenSessionIds = new Set();
        allChats.forEach(chat => {
            if (!seenSessionIds.has(chat.chatSessionId)) {
                uniqueChats.push({
                    chatSessionId: chat.chatSessionId,
                    title: chat.title || "Chat Session"
                });
                seenSessionIds.add(chat.chatSessionId);
            }
        });

        setChatList(uniqueChats);
        setLoading(false);
    };

    const handleDelete = async (chatId) => {
        try {
            const response = await fetch(`/api/tutor/${chatId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Failed to delete the chat.");

            setChatList(prevList => prevList.filter(chat => chat.chatSessionId !== chatId));
            toast.success("Chat history deleted successfully!");

        } catch (error) {
            toast.error("Could not delete the chat.");
        }
    };

    return (
        <div className='p-10'>
            <Link href="/dashboard/tutor">
                <Button className="mb-8"><ArrowLeft className="mr-2" /> Back to Study Space</Button>
            </Link>
            <h2 className='font-bold text-3xl mb-5'>Past Conversation Notes</h2>
            <p className='text-gray-500 mb-8'>Here are your saved notes. Click on "View" to see the full conversation.</p>
            
            {loading ? <p>Loading notes...</p> : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {chatList.length > 0 ? chatList.map((chat, index) => (
                        <div key={index} className='p-6 border rounded-lg shadow-sm h-full flex flex-col justify-between'>
                            <div>
                                <MessageSquare className="h-8 w-8 text-primary mb-4" />
                                <p className="font-semibold text-lg">{chat.title}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Link href={`/dashboard/tutor/${chat.chatSessionId}`}>
                                    <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-2" /> View</Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete this chat history. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(chat.chatSessionId)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )) : (
                        <p>You have no saved notes yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}


export default ChatHistoryPage;