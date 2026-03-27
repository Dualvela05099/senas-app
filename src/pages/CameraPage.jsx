import React, { useRef, useState, useCallback } from 'react';
import { Camera, StopCircle, Play } from 'lucide-react';
import { useSignDetection } from '../hooks/useSignDetection';
import { useHistory } from '../context/HistoryContext';
import HowToCard from '../components/HowToCard';
import './CameraPage.css';

export default function CameraPage() {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);
  const { addDetection } = useHistory();

  const handleDetection = useCallback((letter, confidence) => {
    addDetection(letter, confidence);
  }, [addDetection]);

  const { status, detected } = useSignDetection({
    videoRef,
    canvasRef,
    active,
    onDetection: handleDetection,
  });

  const confidencePct = detected ? Math.round(detected.confidence * 100) : 0;
  const confidenceColor =
    confidencePct >= 75 ? '#27ae60' :
    confidencePct >= 55 ? '#f39c12' : '#e74c3c';

  return (
    <div className="camera-page">
      {/* Video viewport */}
      <div className={`video-container ${active ? 'active' : ''}`}>
        <video
          ref={videoRef}
          className="video-el"
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="canvas-overlay" />

        {/* Idle state */}
        {!active && (
          <div className="video-placeholder">
            <Camera size={48} strokeWidth={1} />
            <p>Presiona iniciar para activar la cámara</p>
          </div>
        )}

        {/* Loading dots */}
        {active && status === 'loading' && (
          <div className="video-placeholder">
            <div className="loading-dots">
              <span /><span /><span />
            </div>
            <p>Cargando modelo…</p>
          </div>
        )}

        {/* Active but no detection */}
        {active && status === 'ready' && !detected && (
          <div className="video-status">
            <div className="status-dots">
              <span /><span /><span />
            </div>
            <Camera size={28} strokeWidth={1} />
            <p>Cámara activa</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="video-placeholder error">
            <p>⚠️ No se pudo acceder a la cámara.</p>
            <p style={{ fontSize: '0.75rem', marginTop: 4 }}>
              Verifica los permisos del navegador.
            </p>
          </div>
        )}
      </div>

      {/* Detection result card */}
      {active && detected && (
        <div className="detection-card">
          <div className="detection-left">
            <span className="detection-label">Letra detectada</span>
            <span className="detection-letter">{detected.letter}</span>
          </div>
          <div className="detection-right">
            <span className="detection-label">Confianza</span>
            <span className="detection-pct" style={{ color: confidenceColor }}>
              {confidencePct}%
            </span>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{ width: `${confidencePct}%`, background: confidenceColor }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="camera-actions">
        {!active ? (
          <button className="btn-start" onClick={() => setActive(true)}>
            <Play size={18} />
            Iniciar Cámara
          </button>
        ) : (
          <button className="btn-stop" onClick={() => setActive(false)}>
            <StopCircle size={18} />
            Detener Cámara
          </button>
        )}
      </div>

      <HowToCard />
    </div>
  );
}
