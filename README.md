# 🤟 Lenguaje de Señas — App React

Aplicación de reconocimiento de señas en tiempo real usando MediaPipe Hands + React.

## 🚀 Instalación y arranque

```bash
# 1. Instala dependencias
npm install

# 2. Inicia el servidor de desarrollo
npm start
```

Abre http://localhost:3000 en tu navegador.

---

## 🔑 Credenciales de demo

| Correo            | Contraseña |
|-------------------|------------|
| demo@señas.mx     | demo123    |
| test@test.com     | 123456     |

---

## 📁 Estructura del proyecto

```
src/
├── App.jsx                      # Raíz: routing entre Login y tabs
├── index.js / index.css         # Punto de entrada + estilos globales
│
├── context/
│   ├── AuthContext.jsx           # Estado de sesión (login/logout)
│   └── HistoryContext.jsx        # Historial de letras detectadas
│
├── hooks/
│   └── useSignDetection.js       # 🧠 MediaPipe Hands + clasificador ASL
│
├── pages/
│   ├── LoginPage.jsx / .css      # Pantalla de inicio de sesión
│   ├── CameraPage.jsx / .css     # Cámara + detección en tiempo real
│   ├── AlphabetPage.jsx / .css   # Cuadrícula A-Z con imágenes
│   └── HistoryPage.jsx / .css    # Historial + palabra formada
│
├── components/
│   ├── Header.jsx / .css         # Barra de navegación con tabs
│   └── HowToCard.jsx / .css      # Tarjeta de ayuda reutilizable
│
└── utils/
    └── alphabet.js               # Datos del abecedario (A-Z)
```

---

## 🧠 Cómo funciona el reconocimiento

1. **MediaPipe Hands** detecta 21 landmarks de la mano en tiempo real desde la webcam.
2. Los landmarks (coordenadas x, y, z) se normalizan y se extraen.
3. Un **clasificador basado en geometría** analiza cuáles dedos están extendidos y las distancias entre puntas para determinar la letra.
4. La letra detectada se guarda en el historial cada ~2 segundos.

### Mejorar el clasificador

Para mayor precisión, reemplaza `classifyASL()` en `useSignDetection.js` con un modelo TF.js:

```js
// En useSignDetection.js
import * as tf from '@tensorflow/tfjs';

const model = await tf.loadLayersModel('/models/asl_model/model.json');
const input = tf.tensor2d([landmarks.flatMap(p => [p.x, p.y, p.z])]);
const pred  = model.predict(input);
const idx   = pred.argMax(-1).dataSync()[0];
const letter = String.fromCharCode(65 + idx);
```

Puedes entrenar tu propio modelo con el dataset de ASL disponible en Kaggle.

---

## 🌐 Permisos requeridos

- **Cámara**: el navegador solicitará permiso la primera vez que presiones "Iniciar Cámara".
- Funciona mejor en Chrome/Edge con conexión HTTPS o localhost.

---

## 📦 Dependencias principales

| Librería                          | Uso                            |
|-----------------------------------|--------------------------------|
| `react` / `react-dom`             | UI                             |
| `@mediapipe/hands`                | Detección de mano (21 puntos)  |
| `@mediapipe/camera_utils`         | Acceso a webcam                |
| `@tensorflow/tfjs`                | (Opcional) modelo ML propio    |
| `lucide-react`                    | Íconos                         |
