import React, { useEffect, useState } from 'react'
import { userAction } from '@/utils/userAction'

const AdminButton = () => {
    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await userAction.fetchAllUsers()
            setUsers(data)
        }
        fetchUsers()
    }, [])

    return (
        <div>
            {users.map(user =>
                <div key={user.user_id}>
                    {user.user_id}
                </div>)}
        </div>
    )
}

export default AdminButton