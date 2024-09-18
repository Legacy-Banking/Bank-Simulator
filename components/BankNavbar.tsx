import { bankNavLinks, transferPayLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { updateUserId } from '@/app/store/userSlice'
import { useAppDispatch } from "@/app/store/hooks";

const BankNavbar = ({ personalAccount }: { personalAccount: Account | null }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const session = null; // Placeholder session object
    const router = useRouter(); // Next.js router
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const supabase = createClient();
    const dispatch = useAppDispatch();

    const unreadMessageCount = 5;

    const handleLinkClick = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleTransactionHistoryClick = () => {
        if (personalAccount) {
            router.push(`/transaction-history?accountid=${personalAccount.id}`);
        } else {
            console.error('No personal account found');
        }
        handleLinkClick();
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        dispatch(updateUserId(null));
        console.log("User logged out");
        router.push('/');
    };

    return (
        <nav className="flexBetween navbar relative z-10 bg-white-200 text-black shadow-md">
            <div className='flex-1 flexStart gap-12'>
                <Link href="/" className="flex items-center gap-0.5" onClick={handleLinkClick}>
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
                    <li key="/dashboard" className='font-inter'>
                        <Link href="/dashboard" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Dashboard
                        </Link>
                    </li>

                    <li key="/transaction-history" className='font-inter'>
                        <button
                            className='hover:text-blue-25 hover:underline underline-blue-25'
                            onClick={handleTransactionHistoryClick}
                        >
                            Transaction History
                        </button>
                    </li>

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

                    <li key="/view-bills" className='font-inter'>
                        <Link href="/view-bills" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Bills
                        </Link>
                    </li>

                    {/* Inbox with Notification */}
                    <li key="/inbox" className='relative font-inter'>
                        <Link href="/inbox" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Inbox
                        </Link>

                        {unreadMessageCount > 0 && (
                            <span className="absolute -top-2 -right-4 bg-yellow-gradient text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {unreadMessageCount}
                            </span>
                        )}
                    </li>
                </ul>

                <div className='flexCenter gap-12'>
                    {session ? (
                        <Link href="/admin" className='hidden xl:block font-inter hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                            Admin
                        </Link>
                    ) : null}

                    <button
                        onClick={handleLogout}
                        className="bg-yellow-gradient text-blackText-100 font-inter font-bold py-2 px-7 rounded-2xl items-center justify-center shadow-md hover:text-blue-25 hover:underline underline-blue-25 hidden xl:block"
                    >
                        Log Out
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
                    {bankNavLinks.map((link) => (
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
                    {session && (
                        <li className='font-inter text-left'>
                            <Link
                                href="/admin"
                                className='block px-10 py-4 hover:text-blue-25 hover:underline underline-blue-25'
                                onClick={handleLinkClick}
                            >
                                Admin
                            </Link>
                        </li>
                    )}
                    <li className='font-inter text-left px-3 py-2'>
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-gradient text-blackText-100 font-inter font-bold py-2 px-7 rounded-2xl inline-flex items-center justify-center shadow-md hover:text-blue-25 hover:underline underline-blue-25"
                        >
                            Log Out
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default BankNavbar;
