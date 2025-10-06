"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Mic, StopCircle, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
    interimResult,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results) {
      const transcript = results.map(result => result.transcript).join(' ');
      setUserAnswer(transcript);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer) {
      saveUserAnswer();
    }
  }, [isRecording]);
  
  const startStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      // The text box is now cleared when a NEW recording starts
      setUserAnswer('');
      setResults([]);
      startSpeechToText();
    }
  };

  const saveUserAnswer = async () => {
    if (userAnswer.length < 10) {
      toast("Answer is too short to save.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockId: interviewData.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      if (!response.ok) throw new Error('Failed to save your answer.');
      toast.success('Answer recorded successfully!');
    } catch (e) {
      toast.error('An error occurred while saving.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full my-10">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
        {/* Webcam Section */}
        <div className="relative flex justify-center items-center bg-gray-100 rounded-lg w-full md:w-1/2 h-[300px]">
          {webCamEnabled ? (
            <Webcam
              mirrored={true}
              style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '10px' }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
                <Image 
                  src="/webcam.png" 
                  width={200} 
                  height={200} 
                  alt="Webcam Placeholder" 
                  priority
                />
                <Button variant="outline" onClick={() => setWebCamEnabled(true)}>Enable Webcam</Button>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <Textarea
            placeholder="Your recorded answer will appear here..."
            value={isRecording ? userAnswer + ' ' + interimResult : userAnswer}
            readOnly
            className="h-[300px] border-primary resize-none"
          />
        </div>
      </div>
      <div className="flex justify-end w-full mt-5">
        <Button
          disabled={loading}
          onClick={startStopRecording}
        >
          {isRecording ? (
            <h2 className="flex gap-2 items-center">
              Stop Recording
            </h2>
          ) : (
            <h2 className="flex gap-2 items-center">
              <Mic /> Record Answer
            </h2>
          )}
        </Button>
      </div>
    </div>
  );
}

export default RecordAnswerSection;