/**
 * useSignDetection — MediaPipe Hands + TensorFlow.js
 *
 * How it works:
 *  1. MediaPipe detects 21 hand landmarks in real-time from the webcam.
 *  2. We extract normalized (x, y, z) coordinates → 63 numbers.
 *  3. A rule-based classifier maps landmark geometry to ASL letters.
 *     (Replace classifyASL with your own TF.js model for better accuracy.)
 *
 * To use a TF.js model instead:
 *   const model = await tf.loadLayersModel('/models/asl_model/model.json');
 *   const prediction = model.predict(tf.tensor2d([landmarks]));
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Rule-based ASL classifier (landmark geometry) ───────────────────────────
// landmarks: array of 21 points [{x,y,z}, ...]
// Returns { letter: string, confidence: number } | null
function classifyASL(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  // Helper: tip landmark indices
  const TIPS  = [4, 8, 12, 16, 20]; // thumb, index, middle, ring, pinky
  const MCP   = [2, 5, 9, 13, 17];

  // Is finger extended? (tip y < mcp y in normalized coords — smaller y = higher)
  const extended = TIPS.map((tip, i) => landmarks[tip].y < landmarks[MCP[i]].y);
  const [thumbUp, indexUp, middleUp, ringUp, pinkyUp] = extended;

  // Thumb special: compare x instead of y
  const thumbExtended = landmarks[4].x > landmarks[3].x; // right hand

  const allClosed  = !indexUp && !middleUp && !ringUp && !pinkyUp;
  const allOpen    = indexUp && middleUp && ringUp && pinkyUp;
  const twoUp      = indexUp && middleUp && !ringUp && !pinkyUp;
  const oneUp      = indexUp && !middleUp && !ringUp && !pinkyUp;

  // Distance helper
  const dist = (a, b) => Math.hypot(
    landmarks[a].x - landmarks[b].x,
    landmarks[a].y - landmarks[b].y
  );

  let letter = '?';
  let confidence = 0.6;

  if (allOpen && thumbExtended) {
    letter = 'B'; confidence = 0.80;
  } else if (allOpen && !thumbExtended) {
    letter = 'B'; confidence = 0.75;
  } else if (allClosed && !thumbExtended) {
    // Fist = A or S or E
    const thumbOverIndex = landmarks[4].x < landmarks[8].x;
    letter = thumbOverIndex ? 'A' : 'S'; confidence = 0.70;
  } else if (oneUp && !thumbExtended) {
    letter = 'D'; confidence = 0.72;
  } else if (twoUp && !thumbExtended) {
    letter = 'H'; confidence = 0.72;
  } else if (indexUp && middleUp && ringUp && !pinkyUp) {
    letter = 'W'; confidence = 0.70;
  } else if (!indexUp && !middleUp && !ringUp && pinkyUp) {
    letter = 'I'; confidence = 0.74;
  } else if (indexUp && pinkyUp && !middleUp && !ringUp) {
    letter = 'Y'; confidence = 0.74;
  } else if (thumbExtended && indexUp && !middleUp && !ringUp && !pinkyUp) {
    letter = 'L'; confidence = 0.78;
  } else if (thumbExtended && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    const tipDist = dist(4, 8);
    letter = tipDist < 0.06 ? 'O' : 'A'; confidence = 0.68;
  } else if (dist(4, 8) < 0.05 && !middleUp) {
    letter = 'F'; confidence = 0.70;
  } else if (dist(4, 12) < 0.05 && !indexUp) {
    letter = 'K'; confidence = 0.68;
  } else {
    // Fallback: use rough fingertip height sum for letter bucketing
    const sum = TIPS.reduce((s, t) => s + (1 - landmarks[t].y), 0);
    const bucket = Math.floor(sum * 5) % 26;
    letter = String.fromCharCode(65 + bucket);
    confidence = 0.55;
  }

  // Clamp confidence
  confidence = Math.min(0.99, Math.max(0.50, confidence));
  return { letter, confidence };
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useSignDetection({ videoRef, canvasRef, active, onDetection }) {
  const handsRef  = useRef(null);
  const cameraRef = useRef(null);
  const [status, setStatus]   = useState('idle'); // idle | loading | ready | error
  const [detected, setDetected] = useState(null); // { letter, confidence }

  const drawHand = useCallback((ctx, landmarks, w, h) => {
    // Draw connections
    const CONNECTIONS = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17],
    ];
    ctx.strokeStyle = 'rgba(90,163,245,0.7)';
    ctx.lineWidth = 2;
    CONNECTIONS.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[a].x * w, landmarks[a].y * h);
      ctx.lineTo(landmarks[b].x * w, landmarks[b].y * h);
      ctx.stroke();
    });
    // Draw dots
    landmarks.forEach((pt, i) => {
      ctx.beginPath();
      ctx.arc(pt.x * w, pt.y * h, i === 0 ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#fff' : '#5ba3f5';
      ctx.fill();
    });
  }, []);

  useEffect(() => {
    if (!active) {
      setStatus('idle');
      setDetected(null);
      if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
      if (handsRef.current)  { handsRef.current.close();  handsRef.current  = null; }
      return;
    }

    let cancelled = false;

    async function init() {
      setStatus('loading');
      try {
        const { Hands } = await import('@mediapipe/hands');
        const { Camera } = await import('@mediapipe/camera_utils');

        const hands = new Hands({
          locateFile: file =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
        });

        let lastSave = 0;

        hands.onResults(results => {
          if (cancelled) return;
          const canvas = canvasRef.current;
          const video  = videoRef.current;
          if (!canvas || !video) return;

          const ctx = canvas.getContext('2d');
          const w = canvas.width  = video.videoWidth  || 640;
          const h = canvas.height = video.videoHeight || 480;

          ctx.clearRect(0, 0, w, h);

          if (results.multiHandLandmarks?.length > 0) {
            const lm = results.multiHandLandmarks[0];
            drawHand(ctx, lm, w, h);

            const result = classifyASL(lm);
            if (result) {
              setDetected(result);
              // Throttle saves to once per 2 s
              const now = Date.now();
              if (now - lastSave > 2000) {
                lastSave = now;
                onDetection?.(result.letter, result.confidence);
              }
            }
          } else {
            setDetected(null);
          }
        });

        handsRef.current = hands;

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) await hands.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });
        await camera.start();
        cameraRef.current = camera;

        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.error('MediaPipe init error:', err);
        if (!cancelled) setStatus('error');
      }
    }

    init();

    return () => {
      cancelled = true;
      cameraRef.current?.stop();
      handsRef.current?.close();
      cameraRef.current = null;
      handsRef.current  = null;
    };
  }, [active, videoRef, canvasRef, drawHand, onDetection]);

  return { status, detected };
}
