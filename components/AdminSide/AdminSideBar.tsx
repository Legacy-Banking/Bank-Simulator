
import AdminNavLink from './AdminNavLink'

const AdminSideBar = ({ activePage, setActivePage }: { activePage: string, setActivePage: (page: string) => void }) => {
    return (
        <nav className="sticky top-0 w-64 min-h-screen pt-28 bg-white z-10">
            <div className='px-4 space-y-8'>
                <AdminNavLink page={'accounts'} activePage={activePage} setActivePage={setActivePage}>Accounts</AdminNavLink>
                <AdminNavLink page={'presets'} activePage={activePage} setActivePage={setActivePage}>Presets</AdminNavLink>
                <AdminNavLink page={'create-bill'} activePage={activePage} setActivePage={setActivePage}>Assign & Create Bill</AdminNavLink>
                <AdminNavLink page={'content-management-system'} activePage={activePage} setActivePage={setActivePage}>CMS</AdminNavLink>

            </div>
        </nav>
    );
}

export default AdminSideBar;


