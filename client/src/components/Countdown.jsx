import React, { useState, useEffect } from 'react';

const Countdown = ({ endTime, onEnd }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(endTime) - new Date();
        if (difference <= 0) return null;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (!newTimeLeft && onEnd) {
                onEnd();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, onEnd]);

    if (!timeLeft) {
        return (
            <span className="text-red-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Auction Ended
            </span>
        );
    }

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="flex items-center gap-1 font-['Space_Grotesk']">
            {timeLeft.days > 0 && (
                <>
                    <span className="text-cyan-400 font-bold">{timeLeft.days}</span>
                    <span className="text-slate-400 text-sm">d</span>
                    <span className="text-slate-500 mx-1">:</span>
                </>
            )}
            <div className="flex items-center">
                <span className="bg-white/5 px-2 py-1 rounded text-white font-bold">{pad(timeLeft.hours)}</span>
                <span className="text-slate-400 text-xs mx-0.5">h</span>
            </div>
            <span className="text-cyan-400 animate-pulse">:</span>
            <div className="flex items-center">
                <span className="bg-white/5 px-2 py-1 rounded text-white font-bold">{pad(timeLeft.minutes)}</span>
                <span className="text-slate-400 text-xs mx-0.5">m</span>
            </div>
            <span className="text-cyan-400 animate-pulse">:</span>
            <div className="flex items-center">
                <span className="bg-white/5 px-2 py-1 rounded text-cyan-400 font-bold">{pad(timeLeft.seconds)}</span>
                <span className="text-slate-400 text-xs mx-0.5">s</span>
            </div>
        </div>
    );
};

export default Countdown;
