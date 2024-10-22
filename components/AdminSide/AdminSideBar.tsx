import { usePathname } from 'next/navigation'
import Link from 'next/link';
import { adminSideBarNavLinks } from '@/constants';

const unstyled = "font-semibold py-3 px-4 rounded-lg block mb-2 bg-white transition-colors duration-300 ease-in-out hover:bg-[rgb(255,231,163)] cursor-pointer";
const styled = "font-semibold py-3 px-4 rounded-lg block mb-2 transition-all duration-300 bg-gradient-to-r from-[#f8bf5b] to-[rgb(255,231,163)] cursor-pointer";

const AdminSideBar = () => {
    const pathname = usePathname();
    return (
        <section className='h-screen flex-col border-l border-gray-200'>
            <nav className="sticky top-0 w-64 h-full pt-28 bg-gray-50 z-10">
                <ul className="px-4 space-y-12 list-none">
                    {adminSideBarNavLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    const linkStyle = isActive ? styled : unstyled;

                    return (
                        <li key={item.route} className='font-inter'>
                        <Link href={item.route} className={linkStyle}>
                            {item.label}
                        </Link>
                        </li>
                    );
                    })}
                </ul>
            </nav>
        </section>
    );
}





export default AdminSideBar;


