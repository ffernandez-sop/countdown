import { useState, useEffect } from 'react';
import { useCountdown } from './hooks/useCountdown';
import { CountdownTimer } from './components/CountdownTimer';
import { TripConfig } from './components/TripConfig';
import { Itinerary } from './components/Itinerary';
import type { ItineraryItem } from './components/Itinerary';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase';

function App() {
  const [destination, setDestination] = useState(() => {
    return localStorage.getItem('tripDestination') || '';
  });
  const [targetDate, setTargetDate] = useState(() => {
    return localStorage.getItem('tripDate') || new Date(new Date().getFullYear() + 1, 0, 1).toISOString();
  });
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  // Sync with Supabase on mount
  useEffect(() => {
    const fetchTrip = async () => {
      // Small check to avoid errors if URls are still placeholders
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-url.supabase.co') {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error("Supabase Error:", error.message, error.details);
          return;
        }

        if (data && data.length > 0) {
          const trip = data[0];
          setDestination(trip.destination);
          setTargetDate(trip.target_date);
          setItinerary(trip.itinerary || []);

          localStorage.setItem('tripDestination', trip.destination);
          localStorage.setItem('tripDate', trip.target_date);
          localStorage.setItem('tripItinerary', JSON.stringify(trip.itinerary));
        }
      }
    };

    fetchTrip();
  }, []);

  const timeLeft = useCountdown(targetDate);

  const handleSaveConfig = async (newDest: string, newDate: string, newItinerary: ItineraryItem[]) => {
    // Convert current input (Local) to unambiguous ISO string (UTC)
    const isoDate = new Date(newDate).toISOString();

    setDestination(newDest);
    setTargetDate(isoDate);
    setItinerary(newItinerary);

    // Save to LocalStorage
    localStorage.setItem('tripDestination', newDest);
    localStorage.setItem('tripDate', isoDate);
    localStorage.setItem('tripItinerary', JSON.stringify(newItinerary));

    // Save to Supabase (Cloud)
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-url.supabase.co') {
      try {
        await supabase.from('trips').insert([
          { destination: newDest, target_date: isoDate, itinerary: newItinerary }
        ]);
      } catch (err) {
        console.error("Cloud sync failed:", err);
      }
    }
  };

  // Background animation variants
  const backgroundVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as any
      }
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Background */}
      <div className="background-layer">
        <motion.div
          variants={backgroundVariants}
          animate="animate"
          className="background-layer" // Using same class for gradient, but motion handles transform
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #581c87 100%)' }}
        />

        {/* Animated Orbs/Glows */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>

        {/* Overlay Grid/Texture */}
        <div className="noise-overlay"></div>
      </div>

      <div className="content-wrapper">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="header"
        >
          <span className="badge">
            Toledo Trip Cuenta regresiva
          </span>
          <h1 className="title">
            {destination}
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <CountdownTimer time={timeLeft} />
        </motion.div>

        <Itinerary items={itinerary} />

        <TripConfig
          initialDestination={destination}
          initialDate={targetDate}
          initialItinerary={itinerary}
          onSave={handleSaveConfig}
        />
      </div>

      <div className="footer">
        © 2024 Toledo Trip Countdown
      </div>
    </div>
  );
}

export default App;
