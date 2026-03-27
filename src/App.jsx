import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HistoryProvider } from './context/HistoryContext';
import LoginPage    from './pages/LoginPage';
import CameraPage   from './pages/CameraPage';
import AlphabetPage from './pages/AlphabetPage';
import HistoryPage  from './pages/HistoryPage';
import Header       from './components/Header';

function AppShell() {
  const { user } = useAuth();
  const [tab, setTab] = useState('camera');

  if (!user) return <LoginPage />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activeTab={tab} onTabChange={setTab} />
      {tab === 'camera'   && <CameraPage />}
      {tab === 'alphabet' && <AlphabetPage />}
      {tab === 'history'  && <HistoryPage />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <AppShell />
      </HistoryProvider>
    </AuthProvider>
  );
}
