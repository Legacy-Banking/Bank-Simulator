import React from 'react'
import { scheduleAction } from '@/utils/scheduleAction'

const ScheduleResolveButton = () => {
    const onClick = () => {
        scheduleAction.executeSchedules()
    }
    return (
        <div>
            <button onClick={onClick}>Resolve</button>
        </div>
    )
}

export default ScheduleResolveButton