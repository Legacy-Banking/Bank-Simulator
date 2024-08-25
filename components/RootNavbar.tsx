'use client'

import { homeNavLinks, transferPayLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const RootNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter(); // Next.js router
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Function to close the dropdown menu
    const handleLinkClick = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    // Placeholder logout function
    const handleLogout = () => {
        // Placeholder for logout logic (e.g., API call to log out the user)
        console.log("User logged out");

        // Redirect to the home page after logout
        router.push('/home');
    };

    return (
        <nav className="flexBetween py-3 px-6 gap-10 relative z-10">
            <div className='flex-1 flexStart gap-12'>
                <Link href="/home" className="flex items-center gap-0.5" onClick={handleLinkClick}>
                    <Image
                        src="/logo.png"
                        width={56}
                        height={56}
                        alt="LearntoBank"
                    />
                    <span className="font-poppins font-medium text-[36px]">
                        <span className="text-yellow-500">Learnto</span>
                        <span className="text-blue-25">Bank</span>
                    </span>
                </Link>
            </div>

            <div className='flex items-center gap-8'>
                <ul className='xl:flex hidden text-small gap-8'>
                    {homeNavLinks.map((link) => (
                        <li key={link.route} className='font-inter'>
                            <Link
                                href={link.route}
                                className='px-4 py-4 hover:text-blue-25 hover:underline underline-blue-25'
                                onClick={handleLinkClick}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className='flexCenter gap-12'>


                    <button
                        onClick={handleLogout}
                        className="bg-yellow-gradient text-blackText-100 font-inter font-bold py-2 px-7 rounded-2xl items-center justify-center shadow-md hover:text-blue-25 hover:underline underline-blue-25 hidden xl:block "
                    >
                        Log In
                    </button>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className='xl:hidden flex items-center'>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? (
                            <Image src="/close-icon.svg" alt="Close Menu" width={32} height={32} />
                        ) : (
                            <Image src="/menu-icon.svg" alt="Open Menu" width={32} height={32} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <ul className='absolute top-full left-0 mt-0.5 bg-white-100 shadow-lg rounded-lg w-full py-4 z-20'>
                    {homeNavLinks.map((link) => (
                        <li key={link.route} className='font-inter text-left'>
                            <Link
                                href={link.route}
                                className='block px-10 py-4 hover:text-blue-25 hover:underline underline-blue-25'
                                onClick={handleLinkClick}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}

                    {/* Log In button for mobile */}
                    <li className='font-inter text-left px-3 py-2'>
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-gradient text-blackText-100 font-inter font-bold py-2 px-7 rounded-2xl inline-flex items-center justify-center shadow-md hover:text-blue-25 hover:underline underline-blue-25"
                        >
                            Log In
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default RootNavbar
