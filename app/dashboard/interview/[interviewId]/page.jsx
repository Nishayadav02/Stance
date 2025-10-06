// "use client";

// import { Button } from "@/components/ui/button";
// import { db } from "@/utils/db";
// import { Stance } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// import { Lightbulb, WebcamIcon } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import Webcam from "react-webcam";

// function Interview({ params }) {
//   const [interviewData, setInterviewData] = useState(null);
//   const [webCamEnabled, setWebCamEnabled] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (params.interviewId) {
//       console.log("params.interviewId:", params.interviewId);
//       console.log(`Fetching details for interview ID: ${params.interviewId}`);
//       GetInterviewDetails(params.interviewId);
//     } else {
//       console.error("No interview ID provided in params.");
//       setError("No interview ID provided.");
//       setLoading(false);
//     }
//   }, [params.interviewId]);

//   const GetInterviewDetails = async (interviewId) => {
//     try {
//       const result = await db
//         .select()
//         .from(Stance)
//         .where(eq(Stance.mockId, interviewId));

//       console.log("Fetch result:", result);

//       if (result.length > 0) {
//         setInterviewData(result[0]);
//         console.log("Fetched interview data:", result[0]);
//       } else {
//         setError("No interview data found.");
//         console.error("No data found for the provided interview ID.");
//       }
//     } catch (error) {
//       setError("Error fetching interview data.");
//       console.error("Error fetching interview data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="my-10">
//       <h2 className="font-bold text-2xl">Let's Get Started</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         <div className="flex flex-col my-5 gap-5">
//           {loading ? (
//             <div>Loading...</div>
//           ) : error ? (
//             <div>{error}</div>
//           ) : interviewData ? (
//             <>
//               <div className="flex flex-col p-5 rounded-lg border gap-5">
//                 <h2 className="text-lg">
//                   <strong>Job Role / Job Position : </strong>
//                   {interviewData.jobPosition}
//                 </h2>
//                 <h2 className="text-lg">
//                   <strong>Job Description / Tech Stack : </strong>
//                   {interviewData.jobDesc}
//                 </h2>
//                 <h2 className="text-lg">
//                   <strong>Years of Experience : </strong>
//                   {interviewData.jobExperience}
//                 </h2>
//               </div>
//               <div className="p-5 border rounded-lg bg-yellow-100">
//                 <h2 className="flex gap-2 items-center">
//                   <Lightbulb className="text-yellow-500" />
//                   <strong>Information :</strong>
//                 </h2>
//                 <h2 className="mt-3 text--500">
//                   {process.env.NEXT_PUBLIC_INFORMATION}
//                 </h2>
//               </div>
//             </>
//           ) : (
//             <div>No interview data available.</div>
//           )}
//         </div>

//         <div>
//           {webCamEnabled ? (
//             <Webcam
//               onUserMedia={() => setWebCamEnabled(true)}
//               onUserMediaError={() => setWebCamEnabled(false)}
//               mirrored={true}
//               style={{
//                 height: 300,
//                 width: 300,
//               }}
//             />
//           ) : (
//             <>
//               <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
//               <Button
//                 className="w-full"
//                 variant="gray"
//                 onClick={() => setWebCamEnabled(true)}
//               >
//                 Enable Web Cam and Microphone
//               </Button>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-end items-end">
//         <Link href={'/dashboard/interview/'+params.interviewId+ '/start'}>
//           <Button>Start Interview</Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Interview;




"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { Stance } from "@/utils/schema"; // Using your updated schema name
import { eq } from "drizzle-orm";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";

function InterviewPage({ params }) {
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

  // Using your original, reliable data-fetching logic
  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(Stance)
        .where(eq(Stance.mockId, interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        setError("No interview data found.");
      }
    } catch (error) {
      setError("Error fetching interview data.");
      console.error("Error fetching interview data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-10">
      <h2 className="font-bold text-3xl mb-2 text-primary">Let's Get Started</h2>
      <p className="text-gray-500 mb-8">Review your interview details and set up your camera before you begin.</p>
      
      {/* State handling from your original code */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : interviewData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Side - Details with improved UI */}
            <div className="flex flex-col gap-5">
                <div className="flex flex-col p-6 rounded-lg border gap-4 bg-white shadow-sm">
                  <div>
                    <h3 className="text-sm text-gray-500">Job Role / Position</h3>
                    <p className="text-lg font-semibold">{interviewData.jobPosition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Job Description / Tech Stack</h3>
                    <p className="text-lg font-semibold">{interviewData.jobDesc}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Years of Experience</h3>
                    <p className="text-lg font-semibold">{interviewData.jobExperience}</p>
                  </div>
                </div>
                <div className="p-5 border-l-4 border-yellow-400 bg-yellow-50 text-yellow-800 rounded-lg">
                  <h3 className="flex gap-2 items-center font-bold"><Lightbulb /> Information:</h3>
                  <p className="mt-2">Enable your webcam and microphone to start your AI mock interview. Click "Start Interview" when you are ready.</p>
                </div>
            </div>
            
            {/* Right Side - Webcam with your local image */}
            <div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-lg border">
              {webCamEnabled ? (
                <Webcam
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
          <div className="flex justify-end mt-8">
            <Link href={`/dashboard/interview/${params.interviewId}/start`}>
              <Button size="lg">Start Interview</Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center">No interview data available.</div>
      )}
    </div>
  );
}

export default InterviewPage;