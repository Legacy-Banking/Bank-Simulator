'use client'

import { bankNavLinks, transferPayLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const BankNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const session = null; // Placeholder session object
    const router = useRouter(); // Next.js router

    // Function to close the dropdown menu
    const handleLinkClick = () => {
        setIsDropdownOpen(false);
    };

    // Placeholder logout function
    const handleLogout = () => {
        // Placeholder for logout logic (e.g., API call to log out the user)
        console.log("User logged out");

        // Redirect to the home page after logout
        router.push('/home');
    };

    return (
        <nav className="flexBetween navbar">
            <div className='flex-1 flexStart gap-12'>
                <Link href="/dashboard" className="flex items-center gap-0.5">
                    <Image
                        src="/logo.png"
                        width={44}
                        height={44}
                        alt="LearntoBank"
                    />
                    <span className="font-poppins font-medium text-[32px]">
                        <span className="text-yellow-500">Learnto</span>
                        <span className="text-blue-25">Bank</span>
                    </span>
                </Link>
            </div>

            <div className='flex items-center gap-12'>
                <ul className='xl:flex hidden text-small gap-12'>
                    {/* Dashboard */}
                    <li key="/dashboard" className='font-inter'>
                        <Link href="/dashboard" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Dashboard
                        </Link>
                    </li>

                    {/* Transaction History */}
                    <li key="/transaction-history" className='font-inter'>
                        <Link href="/transaction-history" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Transaction History
                        </Link>
                    </li>

                    {/* Transfer & Pay Dropdown */}
                    <li className='relative font-inter'>
                        <button
                            className='flex items-center gap-2 hover:text-blue-25 hover:underline underline-blue-25'
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            Transfer & Pay
                            <Image
                                src="/chevron-down.svg"
                                alt="Dropdown Icon"
                                className={`transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                width={16}
                                height={16}
                            />
                        </button>
                        {isDropdownOpen && (
                            <ul className='absolute top-full left-0 mt-3 bg-white-100 shadow-lg rounded-lg w-44'>
                                {transferPayLinks.map((link) => (
                                    <li key={link.route} className='font-inter'>
                                        <Link
                                            href={link.route}
                                            className='block px-5 py-4 hover:text-blue-25 hover:underline underline-blue-25'
                                            onClick={handleLinkClick}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {/* Bills */}
                    <li key="/view-bills" className='font-inter'>
                        <Link href="/view-bills" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Bills
                        </Link>
                    </li>

                    {/* Inbox */}
                    <li key="/inbox" className='font-inter'>
                        <Link href="/inbox" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Inbox
                        </Link>
                    </li>
                </ul>

                <div className='flexCenter gap-12'>
                    {session ? (
                        <Link href="/admin" className='font-inter hover:text-blue-25 hover:underline underline-blue-25'>
                            Admin
                        </Link>
                    ) : null}

                    <button 
                        onClick={handleLogout} 
                        className="bg-yellow-gradient text-blackText-100 font-inter font-bold py-2 px-7 rounded-2xl inline-flex items-center justify-center shadow-md hover:text-blue-25 hover:underline underline-blue-25"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default BankNavbar
