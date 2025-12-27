import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Calendar, MapPin, Plus, Trash2, Clock } from 'lucide-react';
import type { ItineraryItem } from './Itinerary';

interface TripConfigProps {
    initialDestination: string;
    initialDate: string;
    initialItinerary: ItineraryItem[];
    onSave: (destination: string, date: string, itinerary: ItineraryItem[]) => void;
}

export const TripConfig: React.FC<TripConfigProps> = ({ initialDestination, initialDate, initialItinerary, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [destination, setDestination] = useState(initialDestination);
    const [date, setDate] = useState(initialDate);
    const [itinerary, setItinerary] = useState<ItineraryItem[]>(initialItinerary);

    // Sync state when props change (e.g., after loading from Supabase)
    useEffect(() => {
        setDestination(initialDestination);
        // datetime-local input needs YYYY-MM-DDTHH:mm format
        if (initialDate) {
            const dateObj = new Date(initialDate);
            // Manually extract local parts to avoid UTC shift from .toISOString()
            const pad = (n: number) => n.toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            const month = pad(dateObj.getMonth() + 1);
            const day = pad(dateObj.getDate());
            const hours = pad(dateObj.getHours());
            const minutes = pad(dateObj.getMinutes());

            setDate(`${year}-${month}-${day}T${hours}:${minutes}`);
        }
        setItinerary(initialItinerary);
    }, [initialDestination, initialDate, initialItinerary]);

    const handleAddItem = () => {
        const newItem: ItineraryItem = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            activity: '',
            location: ''
        };
        setItinerary([...itinerary, newItem]);
    };

    const handleUpdateItem = (id: string, field: keyof ItineraryItem, value: string) => {
        setItinerary(itinerary.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleRemoveItem = (id: string) => {
        setItinerary(itinerary.filter(item => item.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(destination, date, itinerary);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="settings-btn"
                aria-label="Settings"
            >
                <Settings size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal"
                            style={{ maxWidth: '600px' }}
                        >
                            <div className="modal-header-gradient"></div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="close-btn"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="modal-title">
                                Trip Settings
                            </h2>

                            <form onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '10px' }}>
                                <div className="form-group">
                                    <label className="form-label">
                                        <MapPin size={16} style={{ color: '#c084fc' }} />
                                        Destination
                                    </label>
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="form-input"
                                        placeholder="Where are you going?"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Calendar size={16} style={{ color: '#f472b6' }} />
                                        Arrival Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Clock size={16} style={{ color: '#c084fc' }} />
                                        Itinerary
                                    </label>
                                    <div className="itinerary-form-list">
                                        {itinerary?.map((item) => (
                                            <div key={item.id} className="itinerary-form-item">
                                                <input
                                                    type="date"
                                                    value={item.date}
                                                    onChange={(e) => handleUpdateItem(item.id, 'date', e.target.value)}
                                                    className="form-input"
                                                    style={{ padding: '0.4rem' }}
                                                />
                                                <input
                                                    type="time"
                                                    value={item.time}
                                                    onChange={(e) => handleUpdateItem(item.id, 'time', e.target.value)}
                                                    className="form-input"
                                                    style={{ padding: '0.4rem' }}
                                                />
                                                <input
                                                    type="text"
                                                    value={item.activity}
                                                    onChange={(e) => handleUpdateItem(item.id, 'activity', e.target.value)}
                                                    className="form-input"
                                                    placeholder="Activity"
                                                    style={{ padding: '0.4rem' }}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="remove-item-btn"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="add-item-btn"
                                    >
                                        <Plus size={14} style={{ marginRight: '5px' }} />
                                        Add activity
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    style={{ marginTop: '1rem' }}
                                >
                                    Save Trip
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
