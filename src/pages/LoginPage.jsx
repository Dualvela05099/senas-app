import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Fingerprint } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    // Small delay for UX feel
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    if (!ok) {
      setError('Correo o contraseña incorrectos');
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login-page">
      {/* Background glow */}
      <div className="login-glow" />

      <div className="login-content">
        {/* Icon */}
        <div className="login-icon">
          <Fingerprint size={48} strokeWidth={1.5} />
        </div>

        <h1 className="login-title">Lenguaje de Señas</h1>
        <p className="login-subtitle">Aprende y practica el abecedario</p>

        {/* Card */}
        <div className="login-card">
          <h2>Iniciar sesión</h2>

          {/* Email */}
          <div className="field-group">
            <label>Correo electrónico</label>
            <div className={`input-wrapper ${error && !email ? 'input-error' : ''}`}>
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Password */}
          <div className="field-group">
            <label>Contraseña</label>
            <div className={`input-wrapper ${error ? 'input-error' : ''}`}>
              <Lock size={16} className="input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
              />
              <button
                className="toggle-pwd"
                onClick={() => setShowPwd(v => !v)}
                type="button"
                aria-label="Mostrar/ocultar contraseña"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">{error}</div>
          )}

          {/* Submit */}
          <button
            className={`login-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <LogIn size={18} />
                Continuar
              </>
            )}
          </button>

          <p className="register-link">
            <a href="#register">¿No tienes cuenta? Regístrate</a>
          </p>
        </div>

        {/* Demo note */}
        <div className="login-note">
          <span className="note-dot">💡</span>
          <span>
            <strong>Nota:</strong> La autenticación de huella digital es simulada en esta demo.
            Usa <code>demo@señas.mx</code> / <code>demo123</code>
          </span>
        </div>
      </div>
    </div>
  );
}
