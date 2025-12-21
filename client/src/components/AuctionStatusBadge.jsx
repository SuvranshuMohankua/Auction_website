import React from 'react';

const AuctionStatusBadge = ({ status, endTime }) => {
    const now = new Date();
    const end = new Date(endTime);

    let displayStatus = status;
    let colorClasses = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    let dotColor = 'bg-gray-400';

    if (status === 'active' && end > now) {
        displayStatus = 'Active';
        colorClasses = 'bg-green-500/20 text-green-400 border-green-500/30';
        dotColor = 'bg-green-400 animate-pulse';
    } else if (end <= now || status === 'closed') {
        displayStatus = 'Ended';
        colorClasses = 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        dotColor = 'bg-gray-400';
    }

    return (
        <span className={`${colorClasses} text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border flex items-center gap-2 w-fit`}>
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            {displayStatus}
        </span>
    );
};

export default AuctionStatusBadge;
