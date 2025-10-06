"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LoaderCircle, Briefcase, BookText, PlusSquare } from "lucide-react";

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await fetch('/api/generate-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobPosition,
                    jobDesc,
                    jobExperience,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                })
            });

            if (!response.ok) {
                throw new Error("Failed to generate interview");
            }
            
            const result = await response.json();
            
            if (result.mockId) {
                setOpenDialog(false);
                router.push("/dashboard/interview/" + result.mockId);
            }
        } catch (error) {
            console.error("Error creating interview:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all h-full flex items-center justify-center"
                onClick={() => setOpenDialog(true)}
            >
                <h2 className="text-lg text-center flex gap-2 items-center">
                    <PlusSquare /> Add New
                </h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                {/* 1. Default padding removed from DialogContent */}
                <DialogContent className="max-w-2xl p-0">
                    {/* 2. Header now has its own background and padding */}
                    <DialogHeader className="p-6 bg-secondary rounded-t-lg">
                        <DialogTitle className="text-2xl text-primary">
                            Tell us more about your job Interview
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Fill in the details below to start your personalized AI mock interview.
                        </DialogDescription>
                    </DialogHeader>

                    {/* 3. Form now has its own padding */}
                    <form onSubmit={onSubmit} className="p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 mb-2 font-medium">
                                    <Briefcase className="text-primary" />
                                    Job Role / Job Position
                                </label>
                                <Input
                                    placeholder="Ex. Full Stack Developer"
                                    required
                                    value={jobPosition}
                                    onChange={(event) => setJobPosition(event.target.value)}
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 mb-2 font-medium">
                                    <BookText className="text-primary" />
                                    Job Description / Tech Stack
                                </label>
                                <Textarea
                                    placeholder="Ex. React, Angular, Node.js, MySQL etc."
                                    required
                                    value={jobDesc}
                                    onChange={(event) => setJobDesc(event.target.value)}
                                    className="resize-none"
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 mb-2 font-medium">
                                    <Briefcase className="text-primary" />
                                    Years of Experience
                                </label>
                                <Input
                                    placeholder="Ex. 5"
                                    type="number"
                                    max="50"
                                    required
                                    value={jobExperience}
                                    onChange={(event) => setJobExperience(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-5 justify-end mt-6">
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                                        Generating...
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;