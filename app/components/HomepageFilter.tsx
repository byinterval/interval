'use client';
import { useState } from 'react';
import MoodFilter from './MoodFilter';

// This wrapper handles the state so the Server Component homepage doesn't have to.
export default function HomepageFilter() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const moods = ["Silence", "Texture", "Morning", "Patina", "Low Light"];

  return (
    <MoodFilter 
      moods={moods}
      activeMood={activeMood}
      onMoodSelect={(mood) => setActiveMood(mood === activeMood ? null : mood)}
    />
  );
}