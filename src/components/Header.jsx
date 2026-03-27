import React from 'react';
import { Camera, BookOpen, Clock } from 'lucide-react';
import './Header.css';

const TABS = [
  { id: 'camera',   Icon: Camera,   label: 'Cámara'    },
  { id: 'alphabet', Icon: BookOpen,  label: 'Alfabeto'  },
  { id: 'history',  Icon: Clock,     label: 'Historial' },
];

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="app-header">
      <div className="header-title">
        <h1>Lenguaje de Señas</h1>
        <p>Aprende y practica el abecedario</p>
      </div>
      <nav className="tab-bar">
        {TABS.map(({ id, Icon, label }) => (
          <button
            key={id}
            className={`tab-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
            aria-label={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>
    </header>
  );
}
