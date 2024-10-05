'use client'
import { useAppSelector } from "@/store/userSlice";
import Link from "next/link";
import React from 'react'

const HomeAuthLinks = () => {
    const user = useAppSelector(state => state.user)
    return (
        <div>
            {user.user_id ? (
                <Link href="/dashboard">
                    <button className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-medium text-[#FFFFFF] bg-gradient-to-r from-[#468DC6] to-[#1A70B8] rounded-lg hover:text-gray-600 shadow-2xl">
                        → Dashboard
                    </button>
                </Link>
            ) : (
                <div className="flex flex-col md:flex-row place-items-start space-x-0 space-y-4 md:space-x-10 md:space-y-0">
                    <Link href="/login">
                        <button className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-medium text-[#FFFFFF] bg-gradient-to-r from-[#468DC6] to-[#1A70B8] rounded-lg hover:text-gray-600 shadow-2xl">
                            → Login
                        </button>
                    </Link>
                    <Link href="/sign-up">
                        <button className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-medium text-[#FFFFFF] bg-gradient-to-r from-[#468DC6] to-[#1A70B8] rounded-lg hover:text-gray-600 shadow-2xl">
                            → Sign up
                        </button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default HomeAuthLinks