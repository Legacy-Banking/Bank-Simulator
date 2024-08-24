
import AdminNavLink from './AdminNavLink'
const AdminSideBar = () => {

    return (
        <nav className="w-64 min-h-screen pt-28">
            <div className='px-4'>
                <AdminNavLink href="/admin/accounts">Accounts</AdminNavLink>
                <AdminNavLink href="/admin/presets">Presets</AdminNavLink>
                <AdminNavLink href="/admin/create-bill">Create Bill</AdminNavLink>
                <AdminNavLink href="/admin/additional-funds">Additional Funds</AdminNavLink>
            </div>
        </nav>
    )
}



export default AdminSideBar
