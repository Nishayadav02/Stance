"use client";
import { db } from '@/utils/db';
import { Stance } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function InterviewQuestionsPage({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleAnswers, setVisibleAnswers] = useState({}); // Nayi state answers ko track karne ke liye

    useEffect(() => {
        if(params.interviewId) {
            getInterviewDetails();
        }
    }, [params.interviewId]);

    const getInterviewDetails = async () => {
        setLoading(true);
        const result = await db.select()
            .from(Stance)
            .where(eq(Stance.mockId, params.interviewId));

        if (result.length > 0) {
            const interview = {
                ...result[0],
                questions: JSON.parse(result[0].jsonMockResp)
            };
            setInterviewData(interview);
        }
        setLoading(false);
    };

    // Answer ko show/hide karne ke liye function
    const toggleAnswer = (index) => {
        setVisibleAnswers(prev => ({
            ...prev,
            [index]: !prev[index] // particular question ke liye visibility toggle karein
        }));
    };

    if (loading) {
        return <div className="p-10">Loading interview details...</div>;
    }
    
    if (!interviewData) {
        return <div className="p-10">Could not find interview details.</div>;
    }

    return (
        <div className='p-10'>
            <Link href="/dashboard/questions">
                <Button className="mb-8"><ArrowLeft className="mr-2" /> Back to All Interviews</Button>
            </Link>
            
            <div className='border rounded-lg p-6 shadow-lg bg-white mb-8'>
                <h2 className='text-3xl font-bold text-primary'>{interviewData.jobPosition}</h2>
                <p className='text-md text-gray-600 mt-2'>{interviewData.jobDesc}</p>
                <p className='text-sm text-gray-500 mt-2'><strong>Experience:</strong> {interviewData.jobExperience} years</p>
            </div>
            
            <h3 className='text-2xl font-semibold mb-6'>Questions & Answers</h3>
            <div className='flex flex-col gap-6'>
                {interviewData.questions.map((item, index) => (
                    <div key={index} className='p-5 border rounded-lg bg-gray-50 shadow-sm'>
                        <p className='font-semibold text-lg mb-2'>Q{index + 1}: {item.question}</p>
                        
                        {/* Show/Hide Answer ka logic */}
                        {visibleAnswers[index] ? (
                            <>
                                <p className='text-md text-green-800 bg-green-100 p-3 rounded'>
                                    <strong>Answer:</strong> {item.answer}
                                </p>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className='mt-2 text-xs' 
                                    onClick={() => toggleAnswer(index)}
                                >
                                    Hide Answer
                                </Button>
                            </>
                        ) : (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className='mt-2' 
                                onClick={() => toggleAnswer(index)}
                            >
                                Show Answer
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InterviewQuestionsPage;