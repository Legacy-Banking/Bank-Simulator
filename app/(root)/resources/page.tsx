import React from 'react'

const Resources = () => {
  return (
    <section className="flex w-full flex-col items-center max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
      {/* Header with Background Gradient */}
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-20 lg:py-40 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen bg-gradient-to-b from-[#1A70B8] via-[#4C97D1] to-[#FFFFFF] text-center">
        <h1 className="text-6xl font-bold text-[#FFFFFF] mb-4">Resources</h1>
        <p className="text-xl font-medium text-[#FFFFFF] max-w-6xl mx-auto">
          This page will have information on how to navigate and use the online banking simulator. This will include tutorial videos of the website.
        </p>
      </div>
    </section>
  )
}

export default Resources