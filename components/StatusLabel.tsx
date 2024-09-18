import React from 'react';
import './css/StatusLabel.css'; // External CSS for styling

interface StatusLabelProps {
    status: string;
}

const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
    return (
        <div className={`status-label status-${status}`}>
            {status}
        </div>
    );
}

export default StatusLabel;


