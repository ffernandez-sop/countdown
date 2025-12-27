import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CountdownTime } from '../hooks/useCountdown';

interface CountdownTimerProps {
    time: CountdownTime;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="time-unit">
            <div className="card">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="number"
                    >
                        {value < 10 ? `0${value}` : value}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="label">{label}</span>
        </div>
    );
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ time }) => {
    if (time.isFinished) {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="finished-message"
            >
                <h2 className="finished-title">¡Buen Viaje!</h2>
                <p className="finished-subtitle">It's time to go!</p>
            </motion.div>
        );
    }

    return (
        <div className="timer-container">
            <TimeUnit value={time.days} label="Days" />
            <TimeUnit value={time.hours} label="Hours" />
            <TimeUnit value={time.minutes} label="Minutes" />
            <TimeUnit value={time.seconds} label="Seconds" />
        </div>
    );
};
