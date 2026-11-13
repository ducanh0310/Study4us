/**
 * Pure mathematical, physical, and molecular logic for GiaSư Pro
 * Decoupled from UI for 100% deterministic unit testing.
 */

export interface ExtremaPoint {
  x: number;
  y: number;
  type: 'max' | 'min' | 'root';
}

/**
 * Evaluates basic mathematical formulas in terms of x safely.
 * Supports: +, -, *, /, ^, sin, cos, tan, sqrt, abs, ln, exp, pi, e
 */
export function evaluateMathExpr(expr: string, x: number): number {
  if (!expr || expr.trim() === '') return NaN;

  // Normalize expression
  let clean = expr.trim().toLowerCase();
  
  // Replace standard constants
  clean = clean.replace(/\bpi\b/g, `${Math.PI}`);
  clean = clean.replace(/\be\b/g, `${Math.E}`);

  // Replace power operator x^2 -> Math.pow(x, 2)
  // Simple regex for power replacement
  clean = clean.replace(/([a-z0-9_.\(\)]+)\s*\^\s*([a-z0-9_.\(\)]+)/g, 'Math.pow($1, $2)');

  // Replace functions with Math.*
  clean = clean.replace(/\bsin\b/g, 'Math.sin');
  clean = clean.replace(/\bcos\b/g, 'Math.cos');
  clean = clean.replace(/\btan\b/g, 'Math.tan');
  clean = clean.replace(/\bsqrt\b/g, 'Math.sqrt');
  clean = clean.replace(/\babs\b/g, 'Math.abs');
  clean = clean.replace(/\bln\b/g, 'Math.log');
  clean = clean.replace(/\bexp\b/g, 'Math.exp');

  // Handle implicit multiplication like 2x, 3(x+1)
  clean = clean.replace(/(\d)\s*([xX])/g, '$1*$2');
  clean = clean.replace(/(\d)\s*\(/g, '$1*(');
  clean = clean.replace(/\)\s*([xX])/g, ')*$1');

  // Validate allowed characters for safety
  const allowed = /^[0-9xX\s\+\-\*\/\.\(\),Mathpowcosintlgebqr]+$/;
  if (!allowed.test(clean)) {
    return NaN;
  }

  try {
    const fn = new Function('x', `return ${clean};`);
    const val = fn(x);
    return typeof val === 'number' && !isNaN(val) && isFinite(val) ? val : NaN;
  } catch {
    return NaN;
  }
}

/**
 * Calculates numerical derivative f'(x) using central difference
 */
export function numericalDerivative(expr: string, x: number, h = 1e-5): number {
  const yPlus = evaluateMathExpr(expr, x + h);
  const yMinus = evaluateMathExpr(expr, x - h);
  if (isNaN(yPlus) || isNaN(yMinus)) return NaN;
  return (yPlus - yMinus) / (2 * h);
}

/**
 * Finds roots and local extrema in interval [xMin, xMax]
 */
export function findKeyPoints(expr: string, xMin: number, xMax: number, steps = 200): ExtremaPoint[] {
  const points: ExtremaPoint[] = [];
  const dx = (xMax - xMin) / steps;
  let prevX = xMin;
  let prevY = evaluateMathExpr(expr, prevX);
  let prevD = numericalDerivative(expr, prevX);

  for (let i = 1; i <= steps; i++) {
    const curX = xMin + i * dx;
    const curY = evaluateMathExpr(expr, curX);
    const curD = numericalDerivative(expr, curX);

    // Root check (f(x) crosses 0)
    if (!isNaN(prevY) && !isNaN(curY) && prevY * curY <= 0 && Math.abs(curY - prevY) < 50) {
      // Linear interpolation for root
      const rootX = prevX + (-prevY / (curY - prevY)) * (curX - prevX);
      const rootY = evaluateMathExpr(expr, rootX);
      if (Math.abs(rootY) < 0.1) {
        points.push({ x: Number(rootX.toFixed(3)), y: 0, type: 'root' });
      }
    }

    // Extrema check (f'(x) changes sign)
    if (!isNaN(prevD) && !isNaN(curD) && prevD * curD <= 0) {
      const extType = prevD > 0 ? 'max' : 'min';
      const midX = (prevX + curX) / 2;
      const midY = evaluateMathExpr(expr, midX);
      if (!isNaN(midY)) {
        points.push({ x: Number(midX.toFixed(3)), y: Number(midY.toFixed(3)), type: extType });
      }
    }

    prevX = curX;
    prevY = curY;
    prevD = curD;
  }

  // De-duplicate points close to each other
  const unique: ExtremaPoint[] = [];
  for (const p of points) {
    const exists = unique.some(u => Math.abs(u.x - p.x) < dx * 1.5 && u.type === p.type);
    if (!exists) unique.push(p);
  }

  return unique;
}

/**
 * Harmonic Oscillator (Spring-Mass) Physics
 * Equation: x(t) = A * exp(-damping * t) * cos(omega * t + phi)
 */
export function calculateSpringOscillation(params: {
  m: number; // mass (kg)
  k: number; // spring stiffness (N/m)
  A: number; // amplitude (m)
  damping?: number; // damping factor
  phi?: number; // initial phase (rad)
  t: number; // time (s)
}) {
  const { m, k, A, damping = 0, phi = 0, t } = params;
  const omega0 = Math.sqrt(k / m);
  const T = (2 * Math.PI) / omega0;
  const f = 1 / T;

  const decay = Math.exp(-damping * t);
  const x = A * decay * Math.cos(omega0 * t + phi);
  const v = -A * omega0 * decay * Math.sin(omega0 * t + phi) - damping * x;
  const a = -Math.pow(omega0, 2) * x;

  // Energies (J)
  const W_t = 0.5 * k * Math.pow(x, 2); // Potential
  const W_d = 0.5 * m * Math.pow(v, 2); // Kinetic
  const W = 0.5 * k * Math.pow(A, 2); // Total mechanic energy

  return { omega0, T, f, x, v, a, W_t, W_d, W };
}

/**
 * Simple Pendulum Physics
 * T = 2 * pi * sqrt(l / g)
 */
export function calculatePendulum(params: {
  l: number; // length (m)
  g?: number; // gravity (m/s^2), default 9.8
  alpha0: number; // max angle (rad)
  t: number; // time (s)
}) {
  const { l, g = 9.8, alpha0, t } = params;
  const omega = Math.sqrt(g / l);
  const T = 2 * Math.PI * Math.sqrt(l / g);
  const alpha = alpha0 * Math.cos(omega * t);
  const v = -alpha0 * omega * l * Math.sin(omega * t);
  const a = -Math.pow(omega, 2) * alpha * l;

  return { omega, T, alpha, v, a };
}

/**
 * Projectile Motion (Ném xiên / Ném ngang)
 */
export function calculateProjectile(params: {
  v0: number; // initial speed (m/s)
  angleDeg: number; // angle (degrees)
  h0?: number; // initial height (m)
  g?: number; // gravity (m/s^2)
  t: number;
}) {
  const { v0, angleDeg, h0 = 0, g = 9.8, t } = params;
  const rad = (angleDeg * Math.PI) / 180;
  const vx0 = v0 * Math.cos(rad);
  const vy0 = v0 * Math.sin(rad);

  // Time to reach peak height
  const tPeak = vy0 / g;
  const hMax = h0 + (Math.pow(vy0, 2) / (2 * g));

  // Total flight time when y = 0
  // y(t) = h0 + vy0*t - 0.5*g*t^2 = 0
  // 0.5*g*t^2 - vy0*t - h0 = 0
  const delta = Math.pow(vy0, 2) + 2 * g * h0;
  const tTotal = (vy0 + Math.sqrt(delta)) / g;
  const rangeMax = vx0 * tTotal;

  // State at time t
  const currentT = Math.min(t, tTotal);
  const x = vx0 * currentT;
  const y = Math.max(0, h0 + vy0 * currentT - 0.5 * g * Math.pow(currentT, 2));
  const vx = vx0;
  const vy = vy0 - g * currentT;
  const vTotal = Math.sqrt(vx * vx + vy * vy);

  return {
    tPeak,
    hMax,
    tTotal,
    rangeMax,
    x,
    y,
    vx,
    vy,
    vTotal,
    hasLanded: t >= tTotal,
  };
}

/**
 * Standard Element CPK Color and Radius definitions
 */
export const ELEMENT_PROPERTIES: Record<string, { color: string; radius: number; mass: number; nameVi: string }> = {
  H: { color: '#ffffff', radius: 0.3, mass: 1, nameVi: 'Hiđro' },
  C: { color: '#333333', radius: 0.5, mass: 12, nameVi: 'Cacbon' },
  N: { color: '#2563eb', radius: 0.45, mass: 14, nameVi: 'Nitơ' },
  O: { color: '#dc2626', radius: 0.45, mass: 16, nameVi: 'Oxi' },
  F: { color: '#16a34a', radius: 0.4, mass: 19, nameVi: 'Flo' },
  Na: { color: '#9333ea', radius: 0.65, mass: 23, nameVi: 'Natri' },
  Cl: { color: '#22c55e', radius: 0.6, mass: 35.5, nameVi: 'Clo' },
  S: { color: '#eab308', radius: 0.55, mass: 32, nameVi: 'Lưu huỳnh' },
  P: { color: '#ea580c', radius: 0.55, mass: 31, nameVi: 'Photpho' },
  Fe: { color: '#78716c', radius: 0.65, mass: 56, nameVi: 'Sắt' },
  Cu: { color: '#b45309', radius: 0.65, mass: 64, nameVi: 'Đồng' },
};
