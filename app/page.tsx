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
        <div className="flex w-full m-12 px-12 justify-center items-center bg-white-100 2xl:px-40 3xl:px-72 3xl:m-20">

          {/* Title Section */}
          <div className="flex flex-col space-y-6 mt-[30px] 3xl:space-y-10 3xl:mt-[50px] lg:mr-10 2xl:mr-20">
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl 2xl:text-7xl 3xl:text-8 xl font-bold leading-none text-[#222223] items-center">
              {contentEmbeddings?.title || 'Learning made easy'}
            </h1>

            {/* Subtitle */}
            <p className="text-l md:text-base 2xl:text-lg 3xl:text-xl font-normal leading-6 text-[#535354]">
              {contentEmbeddings?.subtitle || 'Simple and modern banking simulator made to make learning easy'}
            </p>

            {/* Subtitle 2 */}
            <p className="text-l md:text-base 2xl:text-lg 3xl:text-xl font-semibold leading-none text-[#535351]">
              {contentEmbeddings?.start_encourage || 'Login Or Sign Up to START NOW!'}
            </p>

              {/* Buttons for Login & Signup */}
              <HomeAuthLinks />
            </div>

          {/* Image Section */}
          <div className="hidden lg:block left-[100px] top-[100px] 3xl:left-[200px] 3xl:top-[150px]">
            <Image src="/homecard.png" alt="Home Card" width={850} height={800} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col flex-grow bg-[#9d9d9d] w-full py-16 border-b-[20px] border-black 3xl:py-24">
          <div className="flex flex-col lg:flex-row w-full justify-center items-center px-10">
            {/* Box Frame */}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start w-full max-w-screen-lg px-10 gap-12 xl:gap-20 2xl:gap-32 3xl:gap-56">
              {/* Column 1 */}
              <Link href="/resources">
                <div className="flex flex-col items-start space-y-2 w-[280px] 3xl:w-[350px]">
                  <div className="w-full h-[148px] relative 3xl:h-[200px]">
                    <Image src="/demo.png" alt="Learn How to Use this Website" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <h3 className="text-[20px] 3xl:text-[24px] font-bold text-[#17181A] hover:underline">
                    {contentEmbeddings?.resource_column1_title || 'Learn How to Use this Website'}
                  </h3>
                  <p className="text-[14px] 3xl:text-[16px] text-[#5F5F64]">
                    {contentEmbeddings?.resource_column1_description || 'Watch this video demo to learn how to use the website'}
                  </p>

                </div>
              </Link>
              {/* Column 2 */}
              <Link href="https://www.sonicwall.com/phishing-iq-test" target="_blank" rel="noreferrer">
                <div className="flex flex-col items-start space-y-2 w-[280px] 3xl:w-[350px]">
                  <div className="w-full h-[148px] relative 3xl:h-[200px]">
                    <Image src="/phishing.png" alt="Scam Phishing Quiz" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <h3 className="text-[20px] 3xl:text-[24px] font-bold text-[#17181A] hover:underline">
                    {contentEmbeddings?.resource_column2_title || 'Scam Phishing Quiz'}
                  </h3>
                  <p className="text-[14px] 3xl:text-[16px] text-[#5F5F64]">
                    {contentEmbeddings?.resource_column2_description || 'Take this quiz to test your ability to identify fraudulent emails and websites'}
                  </p>
                </div>
              </Link>
              {/* Column 3 */}
              <Link href="https://www.seniorsit.com.au/" target="_blank" rel="noreferrer">
                <div className="flex flex-col items-start space-y-2 w-[280px] 3xl:w-[350px]">
                  <div className="w-full h-[148px] relative 3xl:h-[200px]">
                    <Image src="/seniorit.png" alt="SeniorIT Program" fill style={{ objectFit: 'cover' }} />
                  </div>
                  <h3 className="text-[20px] 3xl:text-[24px] font-bold text-[#17181A] hover:underline">
                    {contentEmbeddings?.resource_column3_title || 'SeniorIT Program'}
                  </h3>
                  <p className="text-[14px] 3xl:text-[16px] text-[#5F5F64]">
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