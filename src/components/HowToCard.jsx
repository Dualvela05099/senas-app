import React from 'react';
import './HowToCard.css';

export default function HowToCard() {
  return (
    <div className="how-to-card">
      <h3>¿Cómo usar la app?</h3>
      <ul>
        <li>
          <span className="how-label">Cámara:</span>
          Activa la cámara para detectar señas en tiempo real
        </li>
        <li>
          <span className="how-label">Alfabeto:</span>
          Consulta el abecedario completo de señas
        </li>
        <li>
          <span className="how-label">Historial:</span>
          Revisa las letras que has practicado
        </li>
      </ul>
    </div>
  );
}
