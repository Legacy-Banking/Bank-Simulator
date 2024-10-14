import React from 'react'
import YouTubeVideo from '@/components/YoutubeVideo'

const Resources = () => {
  return (
    <section className="flex w-full flex-col items-center max-xl:max-h-screen max-xl:overflow-y-scroll font-inter bg-[#FFFFFF]">
      {/* Header with Background Gradient */}
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-20 lg:py-40 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen bg-gradient-to-b from-[#1A70B8] via-[#4C97D1] to-[#FFFFFF] text-center">
        <h1 className="text-6xl font-bold text-[#FFFFFF] mb-4">Resources</h1>
        <p className="text-xl font-medium text-[#FFFFFF] max-w-6xl mx-auto">
          This page will have information on how to navigate and use the online banking simulator. This will include tutorial videos of the website.
        </p>
      </div>

      {/* Video Sections below the gradient */}
      <div className="flex w-full flex-col gap-8 px-5 sm:px-8 py-4 lg:px-20 xl:px-40 2xl:px-72 text-center">
        {/* Video 1 */}
        <div className="mb-8">
          <h2 className="text-xl lg:text-4xl font-semibold text-[#1A70B8] mb-2">Getting Started with LearntoBank</h2>
          <p className="text-lg lg:text-xl font-medium text-slate-700 mb-6">Sign up, Log in, and Dashboard Overview</p>
          <YouTubeVideo videoUrl="https://www.youtube.com/watch?v=fTTGALaRZoc" />
        </div>

        {/* Video 2 */}
        <div className="mb-8">
          <h2 className="text-xl lg:text-4xl font-semibold text-[#1A70B8] mb-2">Managing Transactions</h2>
          <p className="text-lg lg:text-xl font-medium text-slate-700 mb-6">Transfer Funds, Pay Anyone, and Cards</p>
          <YouTubeVideo videoUrl="https://www.youtube.com/watch?v=PLACEHOLDER_URL_2" />
        </div>

        {/* Video 3 */}
        <div className="mb-8">
          <h2 className="text-xl lg:text-4xl font-semibold text-[#1A70B8] mb-2">Bills and Payments with BPAY</h2>
          <p className="text-lg lg:text-xl font-medium text-slate-700 mb-6">Viewing, Paying and Managing your Bills</p>
          <YouTubeVideo videoUrl="https://www.youtube.com/watch?v=PLACEHOLDER_URL_3" />
        </div>

        {/* Video 4 */}
        <div className="mb-8">
          <h2 className="text-xl lg:text-4xl font-semibold text-[#1A70B8] mb-2">Admin</h2>
          <p className="text-lg lg:text-xl font-medium text-slate-700 mb-6">Sign up, Log in, and Dashboard Overview</p>
          <YouTubeVideo videoUrl="https://www.youtube.com/watch?v=PLACEHOLDER_URL_4" />
        </div>
      </div>
    </section>
  )
}

export default Resources
