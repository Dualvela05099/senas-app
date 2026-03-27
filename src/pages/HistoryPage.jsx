import React from 'react';
import { Trash2 } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import HowToCard from '../components/HowToCard';
import './HistoryPage.css';

const LETTER_COLORS = {
  A:'#e74c3c',B:'#3498db',C:'#2ecc71',D:'#9b59b6',E:'#f39c12',
  F:'#1abc9c',G:'#e67e22',H:'#3498db',I:'#e74c3c',J:'#2ecc71',
  K:'#9b59b6',L:'#f39c12',M:'#1abc9c',N:'#e67e22',O:'#3498db',
  P:'#3498db',Q:'#9b59b6',R:'#2ecc71',S:'#e74c3c',T:'#f39c12',
  U:'#1abc9c',V:'#3498db',W:'#e74c3c',X:'#9b59b6',Y:'#2ecc71',
  Z:'#e67e22',
};

export default function HistoryPage() {
  const { detections, clearHistory, formedWord } = useHistory();

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="history-header">
          <h2>Historial de detecciones</h2>
          {detections.length > 0 && (
            <button className="clear-btn" onClick={clearHistory} aria-label="Limpiar historial">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {detections.length === 0 ? (
          <div className="history-empty">
            <p>Aún no hay detecciones.</p>
            <p>Activa la cámara para empezar.</p>
          </div>
        ) : (
          <div className="history-list">
            {detections.map(item => (
              <div key={item.id} className="history-item">
                <div
                  className="history-badge"
                  style={{ background: LETTER_COLORS[item.letter] || '#4a90d9' }}
                >
                  {item.letter}
                </div>
                <span className="history-time">{item.time}</span>
              </div>
            ))}
          </div>
        )}

        {detections.length > 0 && (
          <div className="word-section">
            <span className="word-label">Palabra formada:</span>
            <span className="word-value">{formedWord}</span>
          </div>
        )}
      </div>

      <HowToCard />
    </div>
  );
}
