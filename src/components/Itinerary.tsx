import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export interface ItineraryItem {
    id: string;
    date: string; // YYYY-MM-DD
    time: string;
    activity: string;
    location?: string;
}

interface ItineraryProps {
    items: ItineraryItem[];
}

export const Itinerary: React.FC<ItineraryProps> = ({ items }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (items.length === 0) return null;

    // Group items by date
    const groupedItems = items.reduce((acc, item) => {
        const date = item.date || 'TBD';
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {} as Record<string, ItineraryItem[]>);

    // Sort dates
    const sortedDates = Object.keys(groupedItems).sort();

    return (
        <div className="itinerary-container" style={{ width: '80%' }}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="itinerary-toggle-btn"
            >
                <h2 className="itinerary-title">Itinerario del Viaje</h2>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="itinerary-content">
                            {sortedDates.map((date) => (
                                <div key={date} className="itinerary-day-group">
                                    <div className="itinerary-date-header">
                                        {new Date(date + 'T12:00:00').toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </div>
                                    <div className="timeline">
                                        {groupedItems[date].map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="timeline-item"
                                            >
                                                <div className="timeline-dot"></div>
                                                <div className="timeline-content">
                                                    <div className="timeline-header">
                                                        <span className="timeline-time">
                                                            <Clock size={14} />
                                                            {item.time}
                                                        </span>
                                                        <h3 className="timeline-activity">{item.activity}</h3>
                                                    </div>
                                                    {item.location && (
                                                        <div className="timeline-location">
                                                            <MapPin size={14} />
                                                            {item.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
