import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateMathExpr,
  numericalDerivative,
  findKeyPoints,
  calculateSpringOscillation,
  calculatePendulum,
  calculateProjectile,
  ELEMENT_PROPERTIES,
} from './mathPhysics';

test('evaluateMathExpr evaluates polynomial and trigonometric expressions correctly', () => {
  // f(x) = x^2 - 4x + 3 at x = 0 -> 3
  assert.equal(evaluateMathExpr('x^2 - 4*x + 3', 0), 3);
  // f(x) = x^2 - 4x + 3 at x = 1 -> 0
  assert.equal(evaluateMathExpr('x^2 - 4*x + 3', 1), 0);
  // f(x) = x^2 - 4x + 3 at x = 2 -> -1 (vertex)
  assert.equal(evaluateMathExpr('x^2 - 4*x + 3', 2), -1);

  // Trigonometric sin(0) = 0
  assert.equal(evaluateMathExpr('sin(x)', 0), 0);
  // sin(pi/2) ~ 1
  const sinHalfPi = evaluateMathExpr('sin(x)', Math.PI / 2);
  assert.ok(Math.abs(sinHalfPi - 1) < 1e-4);
});

test('numericalDerivative computes correct slope', () => {
  // f(x) = x^2 -> f'(x) = 2x, at x = 3 -> 6
  const d1 = numericalDerivative('x^2', 3);
  assert.ok(Math.abs(d1 - 6) < 1e-3);

  // f(x) = 2x + 5 -> f'(x) = 2
  const d2 = numericalDerivative('2*x + 5', 10);
  assert.ok(Math.abs(d2 - 2) < 1e-3);
});

test('findKeyPoints identifies vertex of parabola and roots', () => {
  const pts = findKeyPoints('x^2 - 4*x + 3', 0, 4);
  const minPt = pts.find(p => p.type === 'min');
  assert.ok(minPt, 'Should find minimum point');
  assert.ok(Math.abs(minPt.x - 2) < 0.1);
  assert.ok(Math.abs(minPt.y - (-1)) < 0.1);

  const roots = pts.filter(p => p.type === 'root');
  assert.ok(roots.length >= 1, 'Should find roots near 1 and 3');
});

test('calculateSpringOscillation satisfies physical formulas', () => {
  const res = calculateSpringOscillation({
    m: 1, // 1 kg
    k: 100, // 100 N/m -> omega0 = 10 rad/s
    A: 0.1, // 10 cm = 0.1 m
    phi: 0,
    t: 0,
  });

  assert.equal(res.omega0, 10);
  assert.ok(Math.abs(res.x - 0.1) < 1e-6);
  assert.ok(Math.abs(res.v - 0) < 1e-6);
  // Total mechanical energy W = 0.5 * k * A^2 = 0.5 * 100 * 0.01 = 0.5 J
  assert.ok(Math.abs(res.W - 0.5) < 1e-9);
  assert.ok(Math.abs(res.W_t - 0.5) < 1e-9);
  assert.equal(res.W_d, 0);
});

test('calculatePendulum computes period correctly', () => {
  // l = 1m, g = 9.8 -> T = 2 * pi * sqrt(1 / 9.8) ~ 2.007s
  const res = calculatePendulum({
    l: 1,
    g: 9.8,
    alpha0: 0.1,
    t: 0,
  });

  assert.ok(Math.abs(res.T - 2.007) < 0.05);
  assert.equal(res.alpha, 0.1);
});

test('calculateProjectile computes peak and range correctly', () => {
  // v0 = 20 m/s, angle = 45 deg, g = 9.8
  const res = calculateProjectile({
    v0: 20,
    angleDeg: 45,
    g: 9.8,
    t: 0,
  });

  assert.ok(res.hMax > 9 && res.hMax < 11);
  assert.ok(res.rangeMax > 38 && res.rangeMax < 42);
  assert.ok(res.tTotal > 2.5 && res.tTotal < 3.0);
});

test('ELEMENT_PROPERTIES contains basic elements', () => {
  assert.ok(ELEMENT_PROPERTIES.H);
  assert.ok(ELEMENT_PROPERTIES.C);
  assert.ok(ELEMENT_PROPERTIES.O);
  assert.ok(ELEMENT_PROPERTIES.N);
  assert.equal(ELEMENT_PROPERTIES.H.nameVi, 'Hiđro');
});
