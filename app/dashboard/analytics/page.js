import React from 'react';

function AnalyticsPage() {
  return (
    <div className='p-10'>
      {/* <h2 className='font-bold text-3xl mb-5'>My Analytics Dashboard</h2> */}
      <h1 className='text-4xl font-bold text-indigo-800'>My Analytics Dashboard</h1>
      <p className='text-gray-500 mb-8'>
        Here is a summary of your performance across all your mock interviews.
      </p>
      {/* We will build the charts and metric cards here in the next step. */}
      <div className='border-2 border-dashed p-20 mt-10 text-center text-gray-400'>
        Dashboard Content Coming Soon...
      </div>
    </div>
  );
}

export default AnalyticsPage;