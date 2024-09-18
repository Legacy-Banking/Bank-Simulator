import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RootLayout from './(root)/layout';
import { contentAction } from '@/utils/contentAction';
import HomeAuthLinks from '@/components/HomeAuthLinks';
export const revalidate = 60


export default async function Home() {
  const contentEmbeddings = await contentAction.fetchEmbedding('home');
  return (
    <RootLayout>
      <div className="flex flex-col min-h-screen items-center bg-white-100">
        <div className="flex w-full m-5 px-10 max-w-7xl items-center"> {/* Maintain alignment */}

          {/* Title and Image Section */}
          <div className="flex flex-grow items-center justify-between w-full max-h-[60vh]"> {/* Limit maximum height */}
            <div className="flex flex-col space-y-6 flex-grow md:py-40">
              {/* Title */}
              <h1 className="text-xl md:text-6xl lg:text-7xl xl:text-7xl font-bold leading-none text-[#222223]">
                {contentEmbeddings?.title || 'Learning made easy'}
              </h1>

              {/* Subtitle */}
              <p className="text-l md:text-base lg:text-lg font-normal leading-6 text-[#535354]">
                {contentEmbeddings?.subtitle || 'Simple and modern banking simulator made to make learning easy'}
              </p>

              {/* Subtitle 2 */}
              <p className="text-l md:text-base lg:text-lg font-semibold leading-none text-[#535351]">
                {contentEmbeddings?.start_encourage || 'Login Or Sign Up to START NOW!'}
              </p>

              {/* Buttons for Login & Signup */}
              <HomeAuthLinks />
            </div>

            {/* Image Section Adjusted */}
            <div className="relative hidden md:block">
              <Image src="/homecard.png" alt="Home Card" width={650} height={600} layout="fixed" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-row bg-[#9d9d9d] w-full py-10 border-b-[20px] border-[#0B0A0B] flex-grow">
          <div className="flex flex-row w-full justify-center items-center">
            {/* Box Frame */}
            <div className="flex flex-wrap lg:flex-nowrap justify-between items-start w-full max-w-screen-lg gap-20">
              {/* Column 1 */}
              <Link href="/resources">
                <div className="flex flex-col items-start space-y-2 w-[280px] min-w-[280px]">
                  <div className="w-full h-[180px] relative">
                    <Image src="/demo.png" alt="Learn How to Use this Website" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#17181A] hover:underline">
                    {contentEmbeddings?.resource_column1_title || 'Learn How to Use this Website'}
                  </h3>
                  <p className="text-[14px] text-[#5F5F64]">
                    {contentEmbeddings?.resource_column1_description || 'Watch this video demo to learn how to use the website'}
                  </p>

                </div>
              </Link>
              {/* Column 2 */}
              <Link href="https://www.sonicwall.com/phishing-iq-test" target="_blank" rel="noreferrer">
                <div className="flex flex-col items-start space-y-2 w-[280px] min-w-[280px]">
                  <div className="w-full h-[180px] relative">
                    <Image src="/phishing.png" alt="Scam Phishing Quiz" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#17181A] hover:underline">
                    {contentEmbeddings?.resource_column2_title || 'Scam Phishing Quiz'}
                  </h3>
                  <p className="text-[14px] text-[#5F5F64]">
                    {contentEmbeddings?.resource_column2_description || 'Take this quiz to test your ability to identify fraudulent emails and websites'}
                  </p>
                </div>
              </Link>
              {/* Column 3 */}
              <Link href="https://www.seniorsit.com.au/" target="_blank" rel="noreferrer">
                <div className="flex flex-col items-start space-y-2 w-[280px] min-w-[280px]">
                  <div className="w-full h-[180px] relative">
                    <Image src="/seniorit.png" alt="SeniorIT Program" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#17181A] hover:underline">
                    {contentEmbeddings?.resource_column3_title || 'SeniorIT Program'}
                  </h3>
                  <p className="text-[14px] text-[#5F5F64]">
                    {contentEmbeddings?.resource_column3_description || 'Learn more about other resources that are available to aid in your online learning'}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}