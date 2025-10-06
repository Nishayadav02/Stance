"use client";
import { db } from '@/utils/db';
import { Stance } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
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

function QuestionsListPage() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getSavedInterviews();
        }
    }, [user]);

    const getSavedInterviews = async () => {
        setLoading(true);
        const results = await db.select()
            .from(Stance)
            .where(eq(Stance.createdBy, user.primaryEmailAddress.emailAddress))
            .orderBy(Stance.id);
        
        setInterviewList(results);
        setLoading(false);
    };
    
    const handleDelete = async (interviewId) => {
        try {
            const response = await fetch(`/api/interview/${interviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete the interview.");
            }

            setInterviewList(prevList => prevList.filter(interview => interview.mockId !== interviewId));
            toast.success("Interview deleted successfully!");

        } catch (error) {
            console.error("Error deleting interview:", error);
            toast.error("Could not delete the interview.");
        }
    };


    return (
        <div className='p-10'>
            <h2 className='font-bold text-3xl mb-5'>All Your Practice Interviews</h2>
            <p className='text-gray-500 mb-8'>Select an interview to see all its questions and answers.</p>

            {loading ? (
                <p>Loading your interviews...</p>
            ) : interviewList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviewList.map((interview, index) => (
                        <div key={index} className='p-6 border rounded-lg shadow-sm flex flex-col justify-between'>
                            <div>
                                <h3 className='text-xl font-bold text-primary'>{interview.jobPosition}</h3>
                                <p className='text-sm text-gray-500 mt-2'>
                                    Created on: {new Date(interview.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Link href={`/dashboard/questions/${interview.mockId}`}>
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
                                                This will permanently delete this interview and all its data. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(interview.mockId)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have not created any interviews yet.</p>
            )}
        </div>
    );
}

export default QuestionsListPage;