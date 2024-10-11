import React from 'react'
import Image from 'next/image'

const AboutUs = () => {
  return (
    <section className="flex w-full flex-col items-center max-xl:max-h-screen max-xl:overflow-y-scroll font-inter bg-[#FFFFFF]">
      {/* Header with Background Gradient */}
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-20 lg:py-40 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen bg-gradient-to-b from-[#1A70B8] via-[#4C97D1] to-[#FFFFFF] text-center">
        <h1 className="text-6xl font-bold text-[#FFFFFF] mb-4">About Us</h1>
        <p className="text-xl font-medium text-[#FFFFFF] max-w-6xl mx-auto">
          The LearntoBank online banking simulator has been created as part of the Seniors IT project funded by the Victorian
          government through the Adult, Community and Further Education board.
        </p>
      </div>

      {/* First Content Section */}
      <div className="flex w-full flex-col lg:flex-row items-center gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
        <div className="flex w-full flex-col md:w-1/2 py-8">
          <p className="text-lg text-gray-700 leading-8">
            It is designed to help seniors learn how to use an online banking system. The application provides a safe and user-friendly environment to practice essential banking tasks such as paying bills, transferring funds, logging in and
            signing up, and managing multiple accounts like personal, business, and savings. Our aim is to empower users by enhancing their digital literacy and boosting their confidence in using online banking services. By simulating a real-world online banking experience, we enable users to practice and master these tasks at their own pace.
          </p>
        </div>
        <div className="hidden lg:block px-20 mx-auto">
          <Image
            src="/oldlady.png"
            alt="Senior citizens using computer"
            width={480}
            height={480}
            quality={100}
            className="rounded-xl drop-shadow-2xl h-60 w-82 contrast-100"
          />
        </div>
      </div>

      {/* Second Content Section */}
      <div className="flex w-full flex-col text-center px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Project Lead</h2>
        <div className="flex w-full flex-col gap-6 max-w-5xl mx-auto">
          {/* Header Text */}
          <h3 className="text-3xl font-semibold text-gray-900 underline decoration-slate-600">Cheryl Ewin</h3>
          {/* Subtext and description */}
          <p className="text-lg text-start text-gray-700 leading-8">
            Cheryl is an IT tutor who specializes in delivering programs targeted towards the needs of seniors. She teaches at numerous community centers throughout South-East Melbourne and holds a Bachelor in Education, a Graduate Diploma of Professional Development, and a Certificate IV in Information Technology (Networking).
          </p>
        </div>
      </div>

      {/* Footer with Background Gradient */}
      <div className="flex w-full flex-col items-center gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen bg-gradient-to-b from-[#FFFFFF] via-yellow-100 to-[#F6CA4D] text-center">
        <div className="flex w-full flex-col">
          {/* Header */}
          <h2 className="text-4xl font-bold text-gray-900 py-8">Our Success Team</h2>
          {/* Members grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {/* Individual member card */}
            <div className="flex flex-col items-center space-y-4">
              <img src="/khye.png" alt="Khye Shen Tan" className="w-76 h-76 rounded-3xl" />
              <div>
                <h3 className="text-xl font-semibold">Khye Shen Tan</h3>
                <p className="text-sm text-gray-700">Project Owner</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img src="/aidan.png" alt="Aidan Chong" className="w-76 h-76 rounded-3xl quality=100" />
              <div>
                <h3 className="text-xl font-semibold">Aidan Chong</h3>
                <p className="text-sm text-gray-700">Scrum Master</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img src="/sam.png" alt="Samuel Qi" className="w-76 h-76 rounded-3xl" />
              <div>
                <h3 className="text-xl font-semibold">Samuel Qi</h3>
                <p className="text-sm text-gray-700">Quality Assurance</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img src="/fred.png" alt="Fredrick Yang" className="w-76 h-76 rounded-3xl" />
              <div>
                <h3 className="text-xl font-semibold">Fredrick Yang</h3>
                <p className="text-sm text-gray-700">Frontend Designer</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img src="/seth.png" alt="Saite Guo" className="w-76 h-76 rounded-3xl" />
              <div>
                <h3 className="text-xl font-semibold">Saite Guo</h3>
                <p className="text-sm text-gray-700">Backend Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs