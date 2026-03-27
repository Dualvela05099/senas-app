import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ALPHABET } from '../utils/alphabet';
import HowToCard from '../components/HowToCard';
import './AlphabetPage.css';

export default function AlphabetPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="alphabet-page">
      <div className="alphabet-grid">
        {ALPHABET.map(item => (
          <button
            key={item.letter}
            className="sign-card"
            onClick={() => setSelected(item)}
          >
            <div className="sign-img-wrap">
              <img
                src={item.imageUrl}
                alt={`Seña ${item.letter}`}
                loading="lazy"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="sign-fallback" style={{ display: 'none' }}>
                {item.letter}
              </div>
              <span className="sign-letter-badge">{item.letter}</span>
            </div>
            <span className="sign-label">{item.letter}</span>
          </button>
        ))}
      </div>

      <HowToCard />

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <X size={20} />
            </button>
            <div className="modal-img-wrap">
              <img src={selected.imageUrl} alt={`Seña ${selected.letter}`} />
              <div className="modal-fallback">{selected.letter}</div>
            </div>
            <div className="modal-info">
              <span className="modal-letter">{selected.letter}</span>
              <p className="modal-desc">{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
