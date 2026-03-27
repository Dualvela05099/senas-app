import React, { createContext, useContext, useState, useCallback } from 'react';

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const [detections, setDetections] = useState([]);

  const addDetection = useCallback((letter, confidence) => {
    const now = new Date();
    const time = now.toLocaleTimeString('es-MX', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    setDetections(prev => [{ letter, confidence, time, id: Date.now() }, ...prev]);
  }, []);

  const clearHistory = useCallback(() => setDetections([]), []);

  const formedWord = detections
    .slice()
    .reverse()
    .map(d => d.letter)
    .join('');

  return (
    <HistoryContext.Provider value={{ detections, addDetection, clearHistory, formedWord }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => useContext(HistoryContext);
