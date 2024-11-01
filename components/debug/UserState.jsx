'use client'
import React from 'react'
import { useAppSelector } from '@/store/hooks'

const UserState = () => {
    const user = useAppSelector(state => state.user)
    const onClick = () => {
    }
  return (
    <div>
        <button onClick={onClick}>Log user</button>
    </div>
  )
}

export default UserState