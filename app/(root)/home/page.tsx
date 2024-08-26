import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Home = () => {
  return (
    <div className="flex flex-col items-center bg-white">
      <div className="flex w-full m-5 px-10 max-w-7xl">

        {/* Title Section */}
        <div className="flex flex-col space-y-6 mt-[30px]">

          {/* Title */}
          <h1 className="text-xl md:text-5xl lg:text-7xl xl:text-7xl font-bold leading-none text-[#222223] items-center">
            Learning made easy
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base lg:text-lg font-normal leading-6 text-[#535354]">
            Simple and modern banking simulator made to make learning easy
          </p>

          {/* Subtitle 2 */}
          <p className="text-sm md:text-base lg:text-lg font-semibold leading-none text-[#535351]">
            Login Or Sign Up to START NOW !
          </p>

          {/* Buttons for Login & Signup*/}
          <div className="flex space-x-10">
            <Link href="/log-in">
              <button className="px-8 py-3 text-lg font-medium text-[#FFFFFF] bg-gradient-to-r from-[#468DC6] to-[#1A70B8] rounded-lg shadow-md hover:text-gray-600 shadow-2xl">
                → Login
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="px-8 py-3 text-lg font-medium text-[#FFFFFF] bg-gradient-to-r from-[#468DC6] to-[#1A70B8] rounded-lg shadow-md hover:text-gray-600 shadow-2xl">
                → Sign up
              </button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="left-[100px] top-[100px]">
          <Image src="/homecard.png" alt="Home Card" width={650} height={600} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col flex-grow items-center justify-center bg-[#9d9d9d] w-full h-autol py-10 border-b-[20px] border-[#0B0A0B]">
        <div className="max-w-none w-full flex flex-col items-center">
          {/* Box Frame */}
          <div className="flex justify-center items-start gap-20 w-full">
            {/* Column 1 */}
            <Link href="/resources">
              <div className="flex flex-col items-start space-y-2 w-[280px]">
                <div className="w-full h-[148px] bg-[#D9D9D9]"></div>
                <h3 className="text-[20px] font-bold text-[#17181A] hover:underline">Learn How to Use this Website</h3>
                <p className="text-[14px] text-[#5F5F64]">Watch this video demo to learn how to use the website</p>
              </div>
            </Link>
            {/* Column 2 */}
            <Link href="https://www.sonicwall.com/phishing-iq-test" target="_blank" rel="noreferrer">
              <div className="flex flex-col items-start space-y-2 w-[280px]">
                <div className="w-full h-[148px] bg-[#D9D9D9]"></div>
                <h3 className="text-[20px] font-bold text-[#17181A] hover:underline">Scam Phishing Quiz</h3>
                <p className="text-[14px] text-[#5F5F64]">Take this quiz to test your ability to identify fraudulent emails and websites</p>
              </div>
            </Link>
            {/* Column 3 */}
            <Link href="https://beconnected.esafety.gov.au/topic-library/introduction-to-online-banking/getting-started-with-online-banking" target="_blank" rel="noreferrer">
              <div className="flex flex-col items-start space-y-2 w-[280px]">
                <div className="w-full h-[148px] bg-[#D9D9D9]"></div>
                <h3 className="text-[20px] font-bold text-[#17181A] hover:underline">SeniorIT Program</h3>
                <p className="text-[14px] text-[#5F5F64]">Learn more about other resources that are available to aid in your online learning</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
