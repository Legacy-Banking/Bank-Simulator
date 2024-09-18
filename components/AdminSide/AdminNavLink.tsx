
import Link from 'next/link';

const AdminNavLink = ({ href, activePage, page, setActivePage, children }: { href?: string , activePage: string, page: string, setActivePage: (page: string) => void, children: React.ReactNode }) => {
    const isActive = activePage == page;
    
    const unstyled = "font-semibold py-3 px-4 rounded-lg block mb-2 bg-white transition-colors duration-300 ease-in-out hover:bg-[rgb(255,231,163)] cursor-pointer";
    const styled = "font-semibold py-3 px-4 rounded-lg block mb-2 transition-all duration-300 bg-gradient-to-r from-[#f8bf5b] to-[rgb(255,231,163)] cursor-pointer";
    const style = isActive ? styled : unstyled;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setActivePage(page); // Update the active page
      };
    
      return (
        <li className={style} onClick={handleClick}>
          {href ? (
            <Link href={href}>{children}</Link>
          ) : (
            <>{children}</>
          )}
        </li>
      );
        
};

export default AdminNavLink;
