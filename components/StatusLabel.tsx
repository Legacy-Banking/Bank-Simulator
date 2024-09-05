import React from 'react';
import './css/StatusLabel.css'; // External CSS for styling



const StatusLabel = ({ status }) => {
    let className = '';

    switch (status) {
        case 'Paid':
            className = 'status-paid';
            break;
        case 'Pending':
            className = 'status-pending';
            break;
        case 'Overdue':
            className = 'status-overdue';
            break;
        default:
            className = '';
    }

    return (
        <div className={`status-label ${className}`}>
            {status}
        </div>
    );
};

export default StatusLabel;
