import { fetchSystemStatus } from "../services/api";
import type { SystemStatus } from "../types";
import { useEffect, useState } from "react";

// pollingInterval periyot gibi düşünülebilir kaç saniyede kontrol ediyor.
export const useSystemStatus = (pollingInterval = 300) => {
  const [status, setStatus] = useState<SystemStatus>({
    fps: 0,
    tehlike: false,
    tabelalar: [],
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await fetchSystemStatus();
        setStatus(data);
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    const intervalId = setInterval(checkStatus, pollingInterval);
    return () => clearInterval(intervalId); // Cleanup function
  }, [pollingInterval]);
  return { status, isConnected };
};
