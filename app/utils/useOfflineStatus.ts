import { useState, useEffect } from "react";

/**
 * Custom hook to track the user's online/offline status.
 *
 * @returns {boolean} - `true` if the user is offline, `false` if online.
 */
export default function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState<boolean | null>(null); 

  useEffect(() => {
    console.log("useOfflineStatus: useEffect");

    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      // Ensure cleanup on unmount
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  return !!isOffline; 
}