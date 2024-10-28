import { bankNavLinks, transferPayLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateUserId } from '@/store/userSlice'
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { inboxAction } from '@/lib/actions/inboxAction'

const BankNavbar = ({ personalAccount }: { personalAccount: Account | null }) => {
    const user_id = useAppSelector((state) => state.user.user_id)?.toString();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter(); // Next.js router
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const supabase = createClient();
    const dispatch = useAppDispatch();
    const userRole = useAppSelector(state => state.user.user_role);
    const [loading, setLoading] = useState(true);
    const [unreadMessages, setUnreadMessages] = useState<number | undefined>(undefined);

    const fetchUnreadMessages = async () => {
        if (user_id) {
            try {
                const count = await inboxAction.getUnreadMessageCount(user_id);
                console.log(`Fetched unread message count: ${count}`);
                setUnreadMessages(count);  // Update state
                console.log(`Unread Messages: ${count}`);  // Log count to console
            } catch (error) {
                console.error('Error fetching unread messages:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (user_id) {
            // Initial fetch
            fetchUnreadMessages();

            // Set up the real-time subscription
            const subscription = supabase
                .channel('custom-messages-channel') // Unique channel name
                .on(
                    'postgres_changes',
                    {
                        event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
                        schema: 'public',
                        table: 'messages',
                        filter: `to_user=eq.${user_id}`, // Filter by user ID
                    },
                    () => {
                        // Refetch unread messages count whenever there's a change
                        fetchUnreadMessages();
                    }
                )
                .subscribe();

            // Clean up the subscription when the component unmounts
            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [user_id]);

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
        dispatch(updateUserId(''));
        console.log("User logged out");
        router.push('/');
    };

    return (
        <>
            <nav
            data-testid={'bank-navbar'} 
            className="flexBetween navbar relative z-10 bg-white-200 text-black shadow-md">
                <div className='flex-1 flexStart gap-12'>
                    <Link href="/" className="flex items-center gap-0.5" onClick={handleLinkClick}>
                        <Image className='w-9 h-9 sm:w-12 sm:h-12'
                            src="/logo.png"
                            width={44}
                            height={44}
                            alt="LearntoBank"
                        />
                        <span className="font-poppins font-medium text-[26px] sm:text-[36px]">
                            <span className="text-yellow-500">Learnto</span>
                            <span className="text-blue-25">Bank</span>
                        </span>
                    </Link>
                </div>

                <div className='flex items-center gap-12'>
                    <ul className='xl:flex hidden text-base gap-12'>
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

                        {/* Cards */}
                        <li key="/cards" className='font-inter'>
                            <Link href="/cards" className='hover:text-blue-25 hover:underline underline-blue-25' onClick={handleLinkClick}>
                                Cards
                            </Link>
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

                            {typeof unreadMessages === 'number' && unreadMessages > 0 && (
                                <span className="absolute -top-2 -right-4 bg-yellow-gradient text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {unreadMessages}
                                </span>
                            )}
                        </li>
                    </ul>

                    <div className='flexCenter gap-12'>
                        {userRole === 'admin' && (
                            <Link
                                href="/admin/dashboard"
                                className='hidden xl:block font-inter hover:text-blue-25 hover:underline underline-blue-25'
                                onClick={handleLinkClick}
                            >
                                Admin
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="text-lg bg-yellow-gradient text-blackText-100 font-inter font-bold py-2 px-7 rounded-2xl items-center justify-center shadow-md hover:text-blue-25 hover:underline underline-blue-25 hidden xl:block"
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
                        {bankNavLinks.map((link) => {
                            if (link.route === '/transaction-history') {
                                return (
                                    <li key={link.route} className='font-inter text-left'>
                                        <button
                                            onClick={handleTransactionHistoryClick}
                                            className='block px-10 py-4 hover:text-blue-25 hover:underline underline-blue-25'
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={link.route} className='font-inter text-left'>
                                        <Link
                                            href={link.route}
                                            className='block px-10 py-4 hover:text-blue-25 hover:underline underline-blue-25'
                                            onClick={handleLinkClick}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            }
                        })}
                        {/* Inbox with Notification for Mobile Menu */}
                        <li key="/inbox" className='font-inter text-left'>
                            <div className="relative inline-block">
                                <Link
                                    href="/inbox"
                                    className='block px-10 py-4 hover:text-blue-25 hover:underline underline-blue-25'
                                    onClick={handleLinkClick}
                                >
                                    Inbox
                                </Link>

                                {typeof unreadMessages === 'number' && unreadMessages > 0 && (
                                    <span className="absolute top-2 right-6 bg-yellow-gradient text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {unreadMessages}
                                    </span>
                                )}
                            </div>
                        </li>

                        {userRole === 'admin' && (
                            <li className='font-inter text-left'>
                                <Link
                                    href="/admin/dashboard"
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
            {/* Notice Below Navbar */}
            <div className="bg-yellow-300 text-center py-3">
                <p className="text-black font-semibold text-base">
                    PLEASE NOTE: LearnToBank is only a simulation (fake banking website). Transactions are simulations only.
                </p>
            </div>
        </>
    )
}

export default BankNavbar;
