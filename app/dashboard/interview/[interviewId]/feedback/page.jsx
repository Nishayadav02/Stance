"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { PrepGenie } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image"; // Import the Image component

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.interviewId) {
      GetInterviewDetails(params.interviewId);
    } else {
      setError("No interview ID provided.");
      setLoading(false);
    }
  }, [params.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(PrepGenie)
        .where(eq(PrepGenie.mockId, interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        setError("No interview data found.");
      }
    } catch (error) {
      setError("Error fetching interview data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!interviewData) return <div className="p-10">No interview data available.</div>;

  return (
    <div className="my-10 p-5 md:p-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
            <div className="flex flex-col p-5 rounded-lg border gap-5">
              <h2 className="text-lg"><strong>Job Role:</strong> {interviewData.jobPosition}</h2>
              <h2 className="text-lg"><strong>Job Description:</strong> {interviewData.jobDesc}</h2>
              <h2 className="text-lg"><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
            </div>
            <div className="p-5 border rounded-lg bg-yellow-100 text-yellow-700">
              <h2 className="flex gap-2 items-center"><Lightbulb /><strong>Information:</strong></h2>
              <p className="mt-3">Enable your webcam and microphone to start your AI mock interview. Click "Start Interview" when you are ready.</p>
            </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-5 bg-gray-100 rounded-lg">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{ height: 300, width: '100%', borderRadius: '10px' }}
            />
          ) : (
            <>
              <Image 
                src="/webcam.png" 
                width={200} 
                height={200} 
                alt="Webcam Placeholder" 
                priority
              />
              <Button className="w-full mt-4" onClick={() => setWebCamEnabled(true)}>
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end mt-5">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;