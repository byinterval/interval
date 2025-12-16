'use client';
import { useRouter } from 'next/navigation';
import MoodFilter from './MoodFilter';

export default function HomepageFilter() {
  const router = useRouter();
  const moods = ["Silence", "Texture", "Morning", "Patina", "Low Light"];

  const handleNavigation = (mood: string) => {
    // If 'Reset View' is clicked (empty string), do nothing or go to Atlas root
    if (!mood) {
        router.push('/atlas');
    } else {
        router.push(`/atlas?mood=${mood}`);
    }
  };

  return (
    <MoodFilter 
      moods={moods}
      activeMood={null} // No active mood on homepage
      onMoodSelect={handleNavigation}
    />
  );
}