import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text to speech.');
    }
  }

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className='p-5 my-10 border rounded-lg'>
      <div className='grid grid-cols-3 gap-5'>
        {mockInterviewQuestion.map((question, index) => (
          <h2
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer 
            ${activeQuestionIndex === index ? 'bg-primary text-white' : 'bg-secondary'}`}
            key={index}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      <p className='my-5 text-sm md:text-lg font-semibold'>{mockInterviewQuestion[activeQuestionIndex]?.question}</p>
      
      <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)} />
      
      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center text-primary'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <p className='text-sm text-primary my-2'>
          Read the question carefully. When you are ready, click 'Record Answer' and speak clearly. Click 'Stop Recording' when you are finished.
        </p>
      </div>
    </div>
  );
}

export default QuestionsSection;