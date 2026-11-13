import React, { useState, useRef, useEffect, useCallback } from 'react';
import { evaluateMathExpr, numericalDerivative, findKeyPoints } from '../../utils/mathPhysics';
import { CapturedMedia } from '../../types';
import { Camera, Video, RotateCcw, ZoomIn, ZoomOut, Check, Square } from 'lucide-react';

interface MathGraphStudioProps {
  initialExpr?: string;
  onSaveMedia?: (media: CapturedMedia) => void;
}

export const MathGraphStudio: React.FC<MathGraphStudioProps> = ({
  initialExpr = 'x^2 - 4*x + 3',
  onSaveMedia,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [expr1, setExpr1] = useState(initialExpr);
  const [expr2, setExpr2] = useState('');
  const [xMin, setXMin] = useState(-6);
  const [xMax, setXMax] = useState(6);
  const [yMin, setYMin] = useState(-5);
  const [yMax, setYMax] = useState(7);

  const [showTangent, setShowTangent] = useState(true);
  const [tangentX, setTangentX] = useState(0.5);
  const [showExtrema, setShowExtrema] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; xMin: number; xMax: number; yMin: number; yMax: number }>({
    x: 0,
    y: 0,
    xMin: -6,
    xMax: 6,
    yMin: -5,
    yMax: 7,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const PRESET_FORMULAS = [
    { label: 'Parabol y = x² - 4x + 3 (Lớp 9 - 10)', expr: 'x^2 - 4*x + 3', xRange: [-3, 7], yRange: [-3, 7] },
    { label: 'Hàm bậc 3 y = x³ - 3x (Lớp 12)', expr: 'x^3 - 3*x', xRange: [-4, 4], yRange: [-4, 4] },
    { label: 'Lượng giác y = 2·sin(x) (Lớp 11)', expr: '2*sin(x)', xRange: [-7, 7], yRange: [-4, 4] },
    { label: 'Phân thức y = (2x - 1)/(x + 1) (Lớp 12)', expr: '(2*x - 1)/(x + 1)', xRange: [-6, 6], yRange: [-6, 6] },
    { label: 'Trùng phương y = x⁴ - 2x² - 1 (Lớp 12)', expr: 'x^4 - 2*x^2 - 1', xRange: [-3, 3], yRange: [-3, 4] },
    { label: 'Đường thẳng y = 2x - 1 (Lớp 8 - 9)', expr: '2*x - 1', xRange: [-5, 5], yRange: [-5, 5] },
  ];

  const toCanvasX = useCallback(
    (x: number, width: number) => ((x - xMin) / (xMax - xMin)) * width,
    [xMin, xMax]
  );
  const toCanvasY = useCallback(
    (y: number, height: number) => height - ((y - yMin) / (yMax - yMin)) * height,
    [yMin, yMax]
  );

  // Render crisp Light Mode Graph Paper Canvas
  const drawGraph = useCallback(
    (customProgress?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Crisp White Graph Paper Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      if (showGrid) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        const stepX = (xMax - xMin) > 20 ? 2 : 1;
        const startX = Math.floor(xMin / stepX) * stepX;
        for (let x = startX; x <= xMax; x += stepX) {
          const cx = toCanvasX(x, width);
          ctx.beginPath();
          ctx.moveTo(cx, 0);
          ctx.lineTo(cx, height);
          ctx.stroke();

          if (x !== 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = '500 11px "IBM Plex Mono", monospace';
            ctx.fillText(`${x}`, cx - 4, toCanvasY(0, height) + 16);
          }
        }

        const stepY = (yMax - yMin) > 20 ? 2 : 1;
        const startY = Math.floor(yMin / stepY) * stepY;
        for (let y = startY; y <= yMax; y += stepY) {
          const cy = toCanvasY(y, height);
          ctx.beginPath();
          ctx.moveTo(0, cy);
          ctx.lineTo(width, cy);
          ctx.stroke();

          if (y !== 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = '500 11px "IBM Plex Mono", monospace';
            ctx.fillText(`${y}`, toCanvasX(0, width) + 6, cy + 4);
          }
        }
      }

      // Coordinate Axes Ox, Oy
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;

      const originY = toCanvasY(0, height);
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(width - 2, originY);
      ctx.lineTo(width - 12, originY - 5);
      ctx.lineTo(width - 12, originY + 5);
      ctx.fill();
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('x', width - 16, originY - 10);

      const originX = toCanvasX(0, width);
      ctx.beginPath();
      ctx.moveTo(originX, height);
      ctx.lineTo(originX, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX, 2);
      ctx.lineTo(originX - 5, 12);
      ctx.lineTo(originX + 5, 12);
      ctx.fill();
      ctx.fillText('y', originX + 10, 16);

      ctx.fillStyle = '#475569';
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('O', originX - 15, originY + 16);

      const plotCurve = (expr: string, strokeColor: string, maxProgress = 1) => {
        if (!expr.trim()) return;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.beginPath();

        const samples = 800;
        let isStarted = false;
        const limitIndex = Math.floor(samples * maxProgress);

        for (let i = 0; i <= limitIndex; i++) {
          const x = xMin + (i / samples) * (xMax - xMin);
          const y = evaluateMathExpr(expr, x);

          if (isNaN(y) || Math.abs(y) > 1000) {
            isStarted = false;
            continue;
          }

          const cx = toCanvasX(x, width);
          const cy = toCanvasY(y, height);

          if (!isStarted) {
            ctx.moveTo(cx, cy);
            isStarted = true;
          } else {
            const prevX = xMin + ((i - 1) / samples) * (xMax - xMin);
            const prevY = evaluateMathExpr(expr, prevX);
            if (Math.abs(y - prevY) > (yMax - yMin) * 1.5) {
              ctx.moveTo(cx, cy);
            } else {
              ctx.lineTo(cx, cy);
            }
          }
        }
        ctx.stroke();
      };

      const currentProgress = customProgress !== undefined ? customProgress : 1;
      plotCurve(expr1, '#2563eb', currentProgress);

      if (expr2.trim()) {
        plotCurve(expr2, '#dc2626', currentProgress);
      }

      if (showExtrema && currentProgress >= 0.95) {
        const keyPoints = findKeyPoints(expr1, xMin, xMax);
        for (const pt of keyPoints) {
          const cx = toCanvasX(pt.x, width);
          const cy = toCanvasY(pt.y, height);

          if (cx < 0 || cx > width || cy < 0 || cy > height) continue;

          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);

          if (pt.type === 'max') {
            ctx.fillStyle = '#dc2626';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#991b1b';
            ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(`Cực đại (${pt.x}, ${pt.y})`, cx + 8, cy - 10);
          } else if (pt.type === 'min') {
            ctx.fillStyle = '#2563eb';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#1e40af';
            ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(`Cực tiểu (${pt.x}, ${pt.y})`, cx + 8, cy + 16);
          } else if (pt.type === 'root') {
            ctx.fillStyle = '#059669';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#065f46';
            ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(`x=${pt.x}`, cx + 7, cy + 15);
          }
        }
      }

      if (showTangent && currentProgress >= 0.95 && tangentX >= xMin && tangentX <= xMax) {
        const y0 = evaluateMathExpr(expr1, tangentX);
        const slope = numericalDerivative(expr1, tangentX);

        if (!isNaN(y0) && !isNaN(slope)) {
          const cx0 = toCanvasX(tangentX, width);
          const cy0 = toCanvasY(y0, height);

          const deltaX = 3;
          const xA = tangentX - deltaX;
          const yA = y0 - slope * deltaX;
          const xB = tangentX + deltaX;
          const yB = y0 + slope * deltaX;

          ctx.strokeStyle = '#d97706';
          ctx.setLineDash([6, 4]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(toCanvasX(xA, width), toCanvasY(yA, height));
          ctx.lineTo(toCanvasX(xB, width), toCanvasY(yB, height));
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.beginPath();
          ctx.arc(cx0, cy0, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#d97706';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#92400e';
          ctx.font = 'bold 12px "IBM Plex Mono", monospace';
          ctx.fillText(
            `M(${tangentX.toFixed(2)}, ${y0.toFixed(2)}) · f'=${slope.toFixed(2)}`,
            cx0 + 10,
            cy0 - 12
          );
        }
      }

      // Clean Formula Legend Box on Canvas
      ctx.fillStyle = 'rgba(248, 250, 252, 0.92)';
      ctx.fillRect(14, 14, 240, expr2.trim() ? 52 : 34);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(14, 14, 240, expr2.trim() ? 52 : 34);

      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 12px "IBM Plex Mono", monospace';
      ctx.fillText(`f(x) = ${expr1}`, 24, 35);
      if (expr2.trim()) {
        ctx.fillStyle = '#dc2626';
        ctx.fillText(`g(x) = ${expr2}`, 24, 54);
      }
    },
    [expr1, expr2, xMin, xMax, yMin, yMax, showGrid, showExtrema, showTangent, tangentX, toCanvasX, toCanvasY]
  );

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      xMin,
      xMax,
      yMin,
      yMax,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !canvasRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const spanX = dragStartRef.current.xMax - dragStartRef.current.xMin;
    const spanY = dragStartRef.current.yMax - dragStartRef.current.yMin;

    const mathDx = (dx / canvasRef.current.width) * spanX;
    const mathDy = (dy / canvasRef.current.height) * spanY;

    setXMin(dragStartRef.current.xMin - mathDx);
    setXMax(dragStartRef.current.xMax - mathDx);
    setYMin(dragStartRef.current.yMin + mathDy);
    setYMax(dragStartRef.current.yMax + mathDy);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleZoom = (factor: number) => {
    const midX = (xMin + xMax) / 2;
    const midY = (yMin + yMax) / 2;
    const halfSpanX = ((xMax - xMin) * factor) / 2;
    const halfSpanY = ((yMax - yMin) * factor) / 2;

    setXMin(midX - halfSpanX);
    setXMax(midX + halfSpanX);
    setYMin(midY - halfSpanY);
    setYMax(midY + halfSpanY);
  };

  const handleResetView = () => {
    setXMin(-6);
    setXMax(6);
    setYMin(-5);
    setYMax(7);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawGraph(1);
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = `DoThi_Toan_${expr1.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = dataUrl;
    link.click();

    if (onSaveMedia) {
      onSaveMedia({
        id: `img-${Date.now()}`,
        type: 'image',
        title: `Đồ thị f(x) = ${expr1}`,
        subjectId: 'toan',
        gradeId: 10,
        dataUrl,
        format: 'PNG',
        createdAt: new Date().toLocaleString('vi-VN'),
        notes: `Khoảng trục: X[${xMin.toFixed(1)}, ${xMax.toFixed(1)}], Y[${yMin.toFixed(1)}, ${yMax.toFixed(1)}]`,
      });
    }

    showToast('Đã chụp và lưu ảnh đồ thị vào Kho tư liệu!');
  };

  const handleRecordVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    try {
      setIsRecording(true);
      setRecordingProgress(0);
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
        a.download = `Video_VeDoThi_${expr1.replace(/[^a-zA-Z0-9]/g, '_')}.webm`;
        a.click();

        if (onSaveMedia) {
          onSaveMedia({
            id: `vid-${Date.now()}`,
            type: 'video',
            title: `Video vẽ đồ thị: f(x) = ${expr1}`,
            subjectId: 'toan',
            gradeId: 10,
            dataUrl: videoUrl,
            format: 'WEBM',
            createdAt: new Date().toLocaleString('vi-VN'),
            notes: 'Video mô phỏng quá trình vẽ đồ thị từng bước.',
          });
        }

        setIsRecording(false);
        setRecordingProgress(100);
        showToast('Đã quay và tải video vẽ đồ thị thành công!');
      };

      recorder.start();

      const durationMs = 3800;
      const startTime = performance.now();

      const animateStep = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        setRecordingProgress(Math.round(progress * 100));
        drawGraph(progress);

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          setTimeout(() => {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
          }, 1000);
        }
      };

      requestAnimationFrame(animateStep);
    } catch {
      setIsRecording(false);
      showToast('Trình duyệt không hỗ trợ quay video canvas.');
    }
  };

  const currentExtrema = findKeyPoints(expr1, xMin, xMax);

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Studio Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-bold text-slate-900 text-lg tracking-tight">
            Studio Vẽ Đồ Thị & Khảo Sát Hàm Số
          </h2>
          <p className="text-xs text-slate-500">
            Nhập công thức toán học, tìm cực trị, tiếp tuyến và xuất hình ảnh / video bài giảng
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportPNG}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Chụp ảnh đồ thị</span>
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
                <span>Đang quay ({recordingProgress}%)</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Quay video vẽ đồ thị</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout: Left Interactive Stage (68%) + Right Control Deck (32%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto lg:overflow-hidden">
        {/* Left Zone: Interactive Graph Canvas */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden relative min-h-[440px]">
          <div className="flex-1 flex items-center justify-center p-2 bg-white">
            <canvas
              ref={canvasRef}
              width={860}
              height={540}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="w-full h-full max-h-[540px] rounded-xl cursor-grab active:cursor-grabbing"
            />
          </div>

          {/* Floating Zoom Controls on Stage */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 border border-slate-200 rounded-lg p-1 shadow-xs">
            <button
              type="button"
              onClick={() => handleZoom(0.8)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Phóng to"
              aria-label="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(1.25)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Thu nhỏ"
              aria-label="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Đặt lại hệ trục mặc định"
              aria-label="Đặt lại hệ trục mặc định"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Kéo chuột trên mặt phẳng tọa độ để di chuyển khung nhìn</span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={e => setShowGrid(e.target.checked)}
                className="rounded accent-blue-600"
              />
              <span>Hiển thị lưới tọa độ</span>
            </label>
          </div>

          {toastMessage && (
            <div className="absolute bottom-14 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* Right Zone: Control & Concept Deck */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col gap-5 overflow-y-auto">
          {/* Preset Selector */}
          <div>
            <label
              htmlFor="preset-math-select"
              className="text-xs font-semibold text-slate-700 block mb-1.5"
            >
              Hàm số mẫu chương trình Lớp 8 – 12
            </label>
            <select
              id="preset-math-select"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600"
              onChange={e => {
                const preset = PRESET_FORMULAS.find(p => p.expr === e.target.value);
                if (preset) {
                  setExpr1(preset.expr);
                  setXMin(preset.xRange[0]);
                  setXMax(preset.xRange[1]);
                  setYMin(preset.yRange[0]);
                  setYMax(preset.yRange[1]);
                }
              }}
              value={PRESET_FORMULAS.some(p => p.expr === expr1) ? expr1 : ''}
            >
              <option value="" disabled>
                -- Chọn hàm số mẫu --
              </option>
              {PRESET_FORMULAS.map(p => (
                <option key={p.expr} value={p.expr}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Function Input */}
          <div>
            <label
              htmlFor="expr1-input"
              className="text-xs font-semibold text-blue-700 block mb-1.5"
            >
              Hàm số chính f(x) (Đường xanh)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono font-semibold">f(x) =</span>
              <input
                id="expr1-input"
                type="text"
                value={expr1}
                onChange={e => setExpr1(e.target.value)}
                placeholder="VD: x^2 - 4*x + 3"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hỗ trợ: +, -, *, /, ^, sin(x), cos(x), tan(x), sqrt(x), ln(x)
            </p>
          </div>

          {/* Secondary Function Input */}
          <div>
            <label
              htmlFor="expr2-input"
              className="text-xs font-semibold text-rose-700 block mb-1.5"
            >
              Hàm số thứ hai g(x) (Xét tương giao - Tùy chọn)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono font-semibold">g(x) =</span>
              <input
                id="expr2-input"
                type="text"
                value={expr2}
                onChange={e => setExpr2(e.target.value)}
                placeholder="VD: 2*x - 1"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          {/* Tangent Slider Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-tangent" className="text-xs font-bold text-slate-900 cursor-pointer">
                Tiếp tuyến & Đạo hàm tại x₀
              </label>
              <input
                id="toggle-tangent"
                type="checkbox"
                checked={showTangent}
                onChange={e => setShowTangent(e.target.checked)}
                className="rounded accent-blue-600"
              />
            </div>

            {showTangent && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-700">
                  <span>Hoành độ tiếp điểm x₀:</span>
                  <span className="font-mono tabular-nums font-bold text-amber-700">
                    {tangentX.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Hoành độ tiếp điểm x0"
                  min={xMin}
                  max={xMax}
                  step={0.1}
                  value={tangentX}
                  onChange={e => setTangentX(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="pt-1 flex justify-between text-xs font-mono tabular-nums text-slate-600">
                  <span>f({tangentX.toFixed(2)}) = {evaluateMathExpr(expr1, tangentX).toFixed(2)}</span>
                  <span>f'({tangentX.toFixed(2)}) = {numericalDerivative(expr1, tangentX).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Extrema & Roots Table */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="toggle-extrema" className="text-xs font-bold text-slate-900 cursor-pointer">
                Điểm cực trị & Nghiệm trên Ox
              </label>
              <input
                id="toggle-extrema"
                type="checkbox"
                checked={showExtrema}
                onChange={e => setShowExtrema(e.target.checked)}
                className="rounded accent-blue-600"
              />
            </div>

            {showExtrema && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {currentExtrema.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    Không có cực trị hoặc nghiệm trong khoảng đang xét.
                  </p>
                ) : (
                  currentExtrema.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200/80 text-xs"
                    >
                      <span
                        className={`font-semibold ${
                          p.type === 'max'
                            ? 'text-rose-700'
                            : p.type === 'min'
                            ? 'text-blue-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {p.type === 'max'
                          ? '▲ Điểm cực đại'
                          : p.type === 'min'
                          ? '▼ Điểm cực tiểu'
                          : '● Giao điểm trục Ox'}
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900">
                        ({p.x}; {p.y})
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
