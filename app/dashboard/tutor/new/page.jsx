"use client";
import { useUser } from '@clerk/nextjs';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

function NewTutorChatPage() {
    const { user } = useUser();
    const router = useRouter();
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || !user) return;

        const currentMessage = userInput;
        const newMessages = [...chatMessages, { sender: 'user', text: currentMessage }];
        setChatMessages(newMessages);
        setLoading(true);
        setUserInput('');

        try {
            const response = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentMessage,
                    userEmail: user.primaryEmailAddress.emailAddress,
                    chatSessionId: chatId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setChatMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
                if (!chatId) { 
                    setChatId(data.chatSessionId); 
                }
            } else {
                throw new Error("Failed to get response from API");
            }
        } catch (error) {
            console.error("API call failed:", error);
            setChatMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, something went wrong. Please check the server logs.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-10 flex flex-col h-[calc(100vh-72px)]'> 
            <div className='flex justify-between items-center mb-6'>
                <h2 className='font-bold text-3xl'>New Tutor Session</h2>
                <Link href="/dashboard/tutor">
                    <Button><ArrowLeft className="mr-2 h-4 w-4" /> End Session & Save</Button>
                </Link>
            </div>
            
            <div className="flex flex-col flex-1 border rounded-lg shadow-sm overflow-hidden min-h-0">
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary'}`}>
                                    {/* --- CHANGE YAHAN KIYA GAYA HAI --- */}
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="p-3 rounded-lg bg-secondary self-start">
                                Thinking...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>
                <div className="p-4 border-t bg-background flex gap-4">
                    <Input value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()} placeholder="Ask a question..." disabled={loading}/>
                    <Button onClick={handleSendMessage} disabled={loading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NewTutorChatPage;