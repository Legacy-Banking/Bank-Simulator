import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-6">
      <div className="relative w-full max-w-7xl">

        {/* Title Section */}
        <div className="flex flex-col justify-center space-y-6 mt-[30px]">

          {/* Ellipse Decorations
          <div className="absolute w-[205px] h-[70px] border-[3px] border-[#F3A723] rounded-full rotate-[-5deg] top-[140px] left-[70px]"></div>
          <div className="absolute w-[205px] h-[70px] border-[3px] border-[#FAD880] rounded-full rotate-[-10deg] top-[110px] left-[76px]"></div> */}

          {/* Title */}
          <h1 className="text-[78px] font-bold leading-none text-[#222223]">
            Learning made
          </h1>

          {/* Title 2 */}
          <h1 className="text-[78px] font-bold leading-8 tracking-wide text-[#222223]">
            <span className="relative z-10">easy</span>
            <span className="absolute w-[190px] h-[56px] border-[3px] border-[#F3A723] rounded-full rotate-[-4deg] top-[134px] left-[-4px]"></span>
            <span className="absolute w-[190px] h-[56px] border-[3px] border-[#FAD880] rounded-full rotate-[4deg] top-[132px] left-[-10px]"></span>
            <span className="relative inline-block"></span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg font-normal leading-[60px] text-[#535354]">
            Simple and modern banking simulator made to make learning easy
          </p>

          {/* Subtitle 2 */}
          <p className="text-lg font-semibold leading-[10px] text-[#535351]">
            Login Or Sign Up to START NOW !
          </p>

          {/* Buttons */}
          <div className="flex space-x-10">
            <Link href="/log-in">
              <button className="px-8 py-3 text-lg font-medium text-[#FFFFFF] bg-gradient-to-r from-[#468DC6] to-[#1A70B8] rounded-lg shadow-md hover:shadow-2xl">
                → Login
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="px-8 py-3 text-lg font-medium text-[#FFFFFF] bg-gradient-to-r from-[#468DC6] to-[#1A70B8] rounded-lg shadow-md hover:shadow-2xl">
                → Sign up
              </button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="absolute right-[-15px] top-[8px]">
          <Image src="/homecard.png" alt="Home Card" width={650} height={520} />
        </div>
      </div>
    </div>
  )
}

export default Home
