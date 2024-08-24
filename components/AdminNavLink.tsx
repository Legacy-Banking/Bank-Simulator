'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = usePathname() === href;
    
    const unstyled = "font-semibold py-3 px-4 rounded-lg block mb-2 bg-white transition-colors duration-300 ease-in-out hover:bg-[rgb(255,231,163)]";
    const styled = "font-semibold py-3 px-4 rounded-lg block mb-2 transition-all duration-300 bg-gradient-to-r from-[#f8bf5b] to-[rgb(255,231,163)]";
    const style = isActive ? styled : unstyled;

    return (
            <Link href={href}>
        <li className={style}>
                {children}
        </li>
            </Link>
    );
};

export default AdminNavLink;
