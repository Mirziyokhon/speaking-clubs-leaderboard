// Debug utility to check localStorage
export const debugLocalStorage = () => {
  try {
    const stored = localStorage.getItem('clubs');
    console.log('Raw localStorage data:', stored);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Parsed localStorage data:', parsed);
      
      // Check sessions for each club
      parsed.forEach((club: any) => {
        console.log(`Club: ${club.name}, Sessions: ${club.sessions.length}`);
        club.sessions.forEach((session: any, index: number) => {
          console.log(`  Session ${index + 1}: ${session.title} on ${session.date}`);
        });
      });
    } else {
      console.log('No data found in localStorage');
    }
  } catch (error) {
    console.error('Error reading localStorage:', error);
  }
};

// Utility to clear localStorage (for testing)
export const clearLocalStorage = () => {
  localStorage.removeItem('clubs');
  console.log('localStorage cleared');
};
