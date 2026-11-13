import React, { useState, useRef, useEffect, useCallback } from 'react';
import { calculateSpringOscillation, calculatePendulum, calculateProjectile } from '../../utils/mathPhysics';
import { CapturedMedia } from '../../types';
import { Play, Pause, RotateCcw, Camera, Video, Check, Square } from 'lucide-react';

interface PhysicsSimulatorProps {
  initialMode?: 'spring' | 'pendulum' | 'projectile' | 'wave';
  onSaveMedia?: (media: CapturedMedia) => void;
}

export const PhysicsSimulator: React.FC<PhysicsSimulatorProps> = ({
  initialMode = 'spring',
  onSaveMedia,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'spring' | 'pendulum' | 'projectile' | 'wave'>(initialMode);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Spring parameters
  const [springM, setSpringM] = useState(1);
  const [springK, setSpringK] = useState(80);
  const [springA, setSpringA] = useState(0.12);
  const [springDamping, setSpringDamping] = useState(0.02);

  // Pendulum parameters
  const [pendulumL, setPendulumL] = useState(1.2);
  const [pendulumAngle0, setPendulumAngle0] = useState(25);
  const [gravity, setGravity] = useState(9.8);

  // Projectile parameters
  const [projV0, setProjV0] = useState(22);
  const [projAngle, setProjAngle] = useState(45);
  const [projH0] = useState(0);

  // Wave parameters
  const [waveA, setWaveA] = useState(30);
  const [waveLambda] = useState(180);
  const [waveF, setWaveF] = useState(1.5);

  const simTimeRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const historyRef = useRef<Array<{ t: number; x: number; v: number }>>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordSecondsLeft, setRecordSecondsLeft] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReset = () => {
    simTimeRef.current = 0;
    lastTimestampRef.current = null;
    historyRef.current = [];
  };

  const handleModeChange = (newMode: 'spring' | 'pendulum' | 'projectile' | 'wave') => {
    setMode(newMode);
    handleReset();
  };

  // Render Light-Mode Physics Canvas
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const t = simTimeRef.current;

    // Clean White Laboratory Background with subtle grid
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= width; gx += 40) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy <= height; gy += 40) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    if (mode === 'spring') {
      const res = calculateSpringOscillation({
        m: springM,
        k: springK,
        A: springA,
        damping: springDamping,
        t,
      });

      historyRef.current.push({ t, x: res.x, v: res.v });
      if (historyRef.current.length > 140) historyRef.current.shift();

      const ceilingY = 50;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(80, ceilingY - 14, 200, 14);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, ceilingY);
      ctx.lineTo(280, ceilingY);
      ctx.stroke();

      const eqY = 230;
      const pxPerMeter = 600;
      const bobY = eqY + res.x * pxPerMeter;
      const bobX = 180;

      // Spring coil
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bobX, ceilingY);
      const coils = 14;
      const coilLength = bobY - ceilingY - 25;
      for (let i = 1; i <= coils; i++) {
        const cy = ceilingY + (i / coils) * coilLength;
        const cx = bobX + (i % 2 === 0 ? 18 : -18);
        ctx.lineTo(cx, cy);
      }
      ctx.lineTo(bobX, bobY - 25);
      ctx.stroke();

      // Equilibrium line
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(50, eqY);
      ctx.lineTo(310, eqY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#475569';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('VTCB (O)', 55, eqY - 6);

      // Amplitude bounds
      const topA = eqY - springA * pxPerMeter;
      const bottomA = eqY + springA * pxPerMeter;
      ctx.strokeStyle = '#fca5a5';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(70, topA);
      ctx.lineTo(290, topA);
      ctx.moveTo(70, bottomA);
      ctx.lineTo(290, bottomA);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#dc2626';
      ctx.font = '600 11px "IBM Plex Mono", monospace';
      ctx.fillText(`-A (${(-springA * 100).toFixed(0)} cm)`, 75, topA - 6);
      ctx.fillText(`+A (+${(springA * 100).toFixed(0)} cm)`, 75, bottomA + 15);

      // Mass Bob
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(bobX - 26, bobY - 26, 52, 52, 10);
      ctx.fill();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${springM} kg`, bobX, bobY + 4);
      ctx.textAlign = 'left';

      // Velocity vector
      if (Math.abs(res.v) > 0.02) {
        const arrowLen = res.v * 70;
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bobX + 36, bobY);
        ctx.lineTo(bobX + 36, bobY + arrowLen);
        ctx.stroke();

        ctx.fillStyle = '#059669';
        ctx.beginPath();
        const headDir = res.v > 0 ? 1 : -1;
        ctx.moveTo(bobX + 36, bobY + arrowLen + headDir * 6);
        ctx.lineTo(bobX + 31, bobY + arrowLen);
        ctx.lineTo(bobX + 41, bobY + arrowLen);
        ctx.fill();
        ctx.font = 'bold 11px "IBM Plex Mono", monospace';
        ctx.fillText(`v = ${res.v.toFixed(2)} m/s`, bobX + 46, bobY + arrowLen / 2);
      }

      // Real-time x(t) Graph Box
      const graphX = 350;
      const graphY = 45;
      const graphW = width - graphX - 30;
      const graphH = 190;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(graphX, graphY + graphH / 2);
      ctx.lineTo(graphX + graphW, graphY + graphH / 2);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Đồ thị li độ x(t) theo thời gian', graphX + 12, graphY + 20);

      if (historyRef.current.length > 1) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < historyRef.current.length; i++) {
          const pt = historyRef.current[i];
          const px = graphX + (i / 140) * graphW;
          const py = graphY + graphH / 2 - (pt.x / springA) * (graphH / 2 - 24);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Energy Bars Box
      const energyY = 265;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(graphX, energyY, graphW, 215);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(graphX, energyY, graphW, 215);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Bảo toàn cơ năng (W = Wt + Wđ)', graphX + 12, energyY + 24);

      const maxEnergy = Math.max(0.001, res.W);
      const barMaxW = graphW - 165;

      // Wt
      ctx.fillStyle = '#475569';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Thế năng (Wt):', graphX + 12, energyY + 56);
      ctx.fillStyle = '#0284c7';
      const wtW = Math.max(0, (res.W_t / maxEnergy) * barMaxW);
      ctx.fillRect(graphX + 108, energyY + 43, wtW, 16);
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px "IBM Plex Mono", monospace';
      ctx.fillText(`${res.W_t.toFixed(3)} J`, graphX + 116 + wtW, energyY + 56);

      // Wd
      ctx.fillStyle = '#475569';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Động năng (Wđ):', graphX + 12, energyY + 88);
      ctx.fillStyle = '#059669';
      const wdW = Math.max(0, (res.W_d / maxEnergy) * barMaxW);
      ctx.fillRect(graphX + 108, energyY + 75, wdW, 16);
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px "IBM Plex Mono", monospace';
      ctx.fillText(`${res.W_d.toFixed(3)} J`, graphX + 116 + wdW, energyY + 88);

      // W
      ctx.fillStyle = '#475569';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Cơ năng (W):', graphX + 12, energyY + 120);
      ctx.fillStyle = '#d97706';
      const wW = Math.max(0, (res.W / maxEnergy) * barMaxW);
      ctx.fillRect(graphX + 108, energyY + 107, wW, 16);
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px "IBM Plex Mono", monospace';
      ctx.fillText(`${res.W.toFixed(3)} J`, graphX + 116 + wW, energyY + 120);

      // Telemetry Summary
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(graphX + 12, energyY + 144, graphW - 24, 54);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(graphX + 12, energyY + 144, graphW - 24, 54);
      ctx.fillStyle = '#334155';
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.fillText(
        `T = ${res.T.toFixed(2)}s · f = ${res.f.toFixed(2)}Hz · ω = ${res.omega0.toFixed(2)} rad/s`,
        graphX + 22,
        energyY + 166
      );
      ctx.fillText(
        `x = ${(res.x * 100).toFixed(1)} cm · v = ${res.v.toFixed(2)} m/s`,
        graphX + 22,
        energyY + 186
      );
    } else if (mode === 'pendulum') {
      const alpha0Rad = (pendulumAngle0 * Math.PI) / 180;
      const res = calculatePendulum({
        l: pendulumL,
        g: gravity,
        alpha0: alpha0Rad,
        t,
      });

      const pivotX = width / 2;
      const pivotY = 65;
      const scaleL = 260;
      const bobX = pivotX + scaleL * Math.sin(res.alpha);
      const bobY = pivotY + scaleL * Math.cos(res.alpha);

      ctx.fillStyle = '#64748b';
      ctx.fillRect(pivotX - 60, pivotY - 10, 120, 10);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX, pivotY + scaleL + 50);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 64, Math.PI / 2, Math.PI / 2 + res.alpha, res.alpha < 0);
      ctx.stroke();
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 12px "IBM Plex Mono", monospace';
      ctx.fillText(`α = ${((res.alpha * 180) / Math.PI).toFixed(1)}°`, pivotX + 16, pivotY + 84);

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(36, height - 125, 340, 92);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(36, height - 125, 340, 92);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Thông số Con lắc đơn', 50, height - 100);
      ctx.fillStyle = '#334155';
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.fillText(`Chiều dài l = ${pendulumL} m · g = ${gravity} m/s²`, 50, height - 80);
      ctx.fillText(`Chu kỳ T = 2π√(l/g) = ${res.T.toFixed(2)} s`, 50, height - 62);
      ctx.fillText(`Vận tốc v = ${res.v.toFixed(2)} m/s`, 50, height - 44);
    } else if (mode === 'projectile') {
      const res = calculateProjectile({
        v0: projV0,
        angleDeg: projAngle,
        h0: projH0,
        g: gravity,
        t,
      });

      const groundY = height - 75;
      const startX = 65;
      const pxPerMeter = 12;

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, groundY, width, 75);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      const numSteps = 100;
      for (let i = 0; i <= numSteps; i++) {
        const stepT = (i / numSteps) * res.tTotal;
        const pt = calculateProjectile({ v0: projV0, angleDeg: projAngle, h0: projH0, g: gravity, t: stepT });
        const cx = startX + pt.x * pxPerMeter;
        const cy = groundY - pt.y * pxPerMeter;
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const curX = startX + res.x * pxPerMeter;
      const curY = groundY - res.y * pxPerMeter;

      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(curX, curY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(curX + res.vx * 2, curY - res.vy * 2);
      ctx.stroke();

      const peakX = startX + (res.rangeMax / 2) * pxPerMeter;
      const peakY = groundY - res.hMax * pxPerMeter;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#991b1b';
      ctx.font = 'bold 11px "IBM Plex Mono", monospace';
      ctx.fillText(`Hmax = ${res.hMax.toFixed(2)}m`, peakX - 30, peakY - 10);

      const landX = startX + res.rangeMax * pxPerMeter;
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(landX, groundY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.fillText(`L = ${res.rangeMax.toFixed(2)}m`, landX - 30, groundY + 22);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(36, 32, 360, 108);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(36, 32, 360, 108);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Chuyển động Ném xiên', 50, 56);
      ctx.fillStyle = '#334155';
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.fillText(`v₀ = ${projV0} m/s · α = ${projAngle}°`, 50, 76);
      ctx.fillText(`Tầm xa L = ${res.rangeMax.toFixed(2)} m · Hmax = ${res.hMax.toFixed(2)} m`, 50, 96);
      ctx.fillText(`t = ${t.toFixed(2)} s / ${res.tTotal.toFixed(2)} s · v = ${res.vTotal.toFixed(2)} m/s`, 50, 116);
    } else if (mode === 'wave') {
      const centerY = height / 2;
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3.5;
      ctx.beginPath();

      const omega = 2 * Math.PI * waveF;
      const k = (2 * Math.PI) / waveLambda;

      for (let x = 0; x < width; x += 3) {
        const y = centerY + waveA * Math.sin(omega * t - k * x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (let x = 40; x < width; x += 80) {
        const y = centerY + waveA * Math.sin(omega * t - k * x);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, centerY - waveA - 24);
      ctx.lineTo(100 + waveLambda, centerY - waveA - 24);
      ctx.stroke();
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 12px "IBM Plex Mono", monospace';
      ctx.fillText(`Bước sóng λ = ${(waveLambda / 100).toFixed(1)} m`, 110, centerY - waveA - 32);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(36, height - 108, 340, 76);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(36, height - 108, 340, 76);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Sóng cơ học hình sin', 50, height - 84);
      ctx.fillStyle = '#334155';
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      const vWave = (waveLambda / 100) * waveF;
      ctx.fillText(`f = ${waveF} Hz · T = ${(1 / waveF).toFixed(2)} s · v = ${vWave.toFixed(2)} m/s`, 50, height - 60);
    }
  }, [
    mode,
    springM,
    springK,
    springA,
    springDamping,
    pendulumL,
    pendulumAngle0,
    gravity,
    projV0,
    projAngle,
    projH0,
    waveA,
    waveLambda,
    waveF,
  ]);

  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (lastTimestampRef.current !== null && isPlaying) {
        const dt = (now - lastTimestampRef.current) / 1000;
        const safeDt = Math.min(dt, 0.1);
        simTimeRef.current += safeDt * speedMultiplier;
      }
      lastTimestampRef.current = now;

      renderFrame();
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    animationFrameIdRef.current = animId;

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, speedMultiplier, renderFrame]);

  const handleExportSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderFrame();
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `MoPhong_VatLy_${mode}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    if (onSaveMedia) {
      onSaveMedia({
        id: `img-phys-${Date.now()}`,
        type: 'image',
        title: `Mô phỏng Vật Lý: ${
          mode === 'spring'
            ? 'Con lắc lò xo'
            : mode === 'pendulum'
            ? 'Con lắc đơn'
            : mode === 'projectile'
            ? 'Ném xiên'
            : 'Sóng cơ'
        }`,
        subjectId: 'ly',
        gradeId: 12,
        dataUrl,
        format: 'PNG',
        createdAt: new Date().toLocaleString('vi-VN'),
        notes: `Thời điểm t = ${simTimeRef.current.toFixed(2)}s`,
      });
    }

    showToast('Đã chụp và lưu ảnh mô phỏng Vật Lý!');
  };

  const handleRecordVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    try {
      setIsRecording(true);
      recordedChunksRef.current = [];
      const stream = canvas.captureStream(30);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2500000 });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `Video_MoPhong_VatLy_${mode}.webm`;
        a.click();

        if (onSaveMedia) {
          onSaveMedia({
            id: `vid-phys-${Date.now()}`,
            type: 'video',
            title: `Video Vật Lý: ${
              mode === 'spring'
                ? 'Con lắc lò xo'
                : mode === 'pendulum'
                ? 'Con lắc đơn'
                : mode === 'projectile'
                ? 'Ném xiên'
                : 'Sóng cơ học'
            }`,
            subjectId: 'ly',
            gradeId: 12,
            dataUrl: videoUrl,
            format: 'WEBM',
            createdAt: new Date().toLocaleString('vi-VN'),
            notes: 'Video mô phỏng chuyển động vật lý.',
          });
        }

        setIsRecording(false);
        showToast('Đã quay và lưu video mô phỏng thành công!');
      };

      recorder.start();

      const recordDuration = 6;
      setRecordSecondsLeft(recordDuration);

      let counter = recordDuration;
      const interval = setInterval(() => {
        counter -= 1;
        setRecordSecondsLeft(counter);
        if (counter <= 0) {
          clearInterval(interval);
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }
      }, 1000);
    } catch {
      setIsRecording(false);
      showToast('Không thể quay video trên trình duyệt hiện tại.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Studio Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-bold text-slate-900 text-lg tracking-tight">
            Studio Mô Phỏng Chuyển Động & Dao Động Vật Lý
          </h2>
          <p className="text-xs text-slate-500">
            Trực quan hóa con lắc lò xo, con lắc đơn, ném xiên và sóng cơ học theo thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportSnapshot}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Chụp ảnh minh họa</span>
          </button>

          <button
            type="button"
            onClick={handleRecordVideo}
            disabled={isRecording}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Đang quay ({recordSecondsLeft}s)</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Quay video mô phỏng (6s)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto lg:overflow-hidden">
        {/* Left Zone: Interactive Physics Stage */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden relative min-h-[440px]">
          {/* Mode Tabs Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'spring', label: 'Con lắc lò xo (Lớp 11 - 12)' },
              { id: 'pendulum', label: 'Con lắc đơn (Lớp 12)' },
              { id: 'projectile', label: 'Ném xiên (Lớp 10)' },
              { id: 'wave', label: 'Sóng cơ hình sin (Lớp 11)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleModeChange(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center p-2 bg-white">
            <canvas
              ref={canvasRef}
              width={860}
              height={520}
              className="w-full h-full max-h-[520px] rounded-xl"
            />
          </div>

          {toastMessage && (
            <div className="absolute bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* Right Zone: Control & Concept Deck */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-5 overflow-y-auto">
          {/* Playback & Speed Deck */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Tạm dừng mô phỏng' : 'Chạy mô phỏng'}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Tiếp tục</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Đặt lại thời gian t = 0"
                aria-label="Đặt lại thời gian t = 0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200">
              {[0.5, 1, 1.5].map(speed => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setSpeedMultiplier(speed)}
                  className={`px-2 py-1 rounded text-xs font-mono font-semibold cursor-pointer ${
                    speedMultiplier === speed
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Mode Sliders */}
          {mode === 'spring' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Thông số Con lắc lò xo
              </h3>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Khối lượng vật nặng (m):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">{springM} kg</span>
                </div>
                <input
                  type="range"
                  aria-label="Khối lượng vật nặng m"
                  min={0.2}
                  max={3}
                  step={0.1}
                  value={springM}
                  onChange={e => setSpringM(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Độ cứng lò xo (k):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">{springK} N/m</span>
                </div>
                <input
                  type="range"
                  aria-label="Độ cứng lò xo k"
                  min={20}
                  max={200}
                  step={5}
                  value={springK}
                  onChange={e => setSpringK(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Biên độ dao động (A):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">
                    {(springA * 100).toFixed(0)} cm
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Biên độ dao động A"
                  min={0.04}
                  max={0.2}
                  step={0.01}
                  value={springA}
                  onChange={e => setSpringA(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Hệ số tắt dần ma sát:</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">
                    {springDamping}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Hệ số tắt dần ma sát"
                  min={0}
                  max={0.1}
                  step={0.005}
                  value={springDamping}
                  onChange={e => setSpringDamping(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {mode === 'pendulum' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Thông số Con lắc đơn
              </h3>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Chiều dài dây treo (l):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">{pendulumL} m</span>
                </div>
                <input
                  type="range"
                  aria-label="Chiều dài dây treo l"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={pendulumL}
                  onChange={e => setPendulumL(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Biên độ góc (α₀):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">
                    {pendulumAngle0}°
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Biên độ góc alpha0"
                  min={5}
                  max={45}
                  step={1}
                  value={pendulumAngle0}
                  onChange={e => setPendulumAngle0(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Gia tốc trọng trường (g):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">
                    {gravity} m/s²
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Gia tốc trọng trường g"
                  min={9.7}
                  max={10}
                  step={0.05}
                  value={gravity}
                  onChange={e => setGravity(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {mode === 'projectile' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Thông số Ném xiên
              </h3>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Vận tốc ban đầu (v₀):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">{projV0} m/s</span>
                </div>
                <input
                  type="range"
                  aria-label="Vận tốc ban đầu v0"
                  min={10}
                  max={40}
                  step={1}
                  value={projV0}
                  onChange={e => setProjV0(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Góc ném hợp với phương ngang (α):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">{projAngle}°</span>
                </div>
                <input
                  type="range"
                  aria-label="Góc ném alpha"
                  min={15}
                  max={75}
                  step={1}
                  value={projAngle}
                  onChange={e => setProjAngle(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {mode === 'wave' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Thông số Sóng cơ học
              </h3>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Tần số dao động (f):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">{waveF} Hz</span>
                </div>
                <input
                  type="range"
                  aria-label="Tần số dao động f"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={waveF}
                  onChange={e => setWaveF(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1.5">
                  <span>Biên độ sóng (A):</span>
                  <span className="font-mono tabular-nums font-bold text-blue-700">{waveA} mm</span>
                </div>
                <input
                  type="range"
                  aria-label="Biên độ sóng A"
                  min={10}
                  max={60}
                  step={2}
                  value={waveA}
                  onChange={e => setWaveA(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 block mb-1">Hướng dẫn giảng dạy:</strong>
            Điều chỉnh thanh trượt để học sinh quan sát sự thay đổi của chu kỳ T, tầm bay xa L hoặc sự chuyển hóa qua lại giữa Động năng và Thế năng.
          </div>
        </div>
      </div>
    </div>
  );
};
