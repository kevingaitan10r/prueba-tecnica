import { describe, it, expect } from 'vitest';
import {
  evaluateNeuroMath,
  evaluateSocialImpact,
  applyGerenciaEffects
} from '../src/simulators/scoring.js';

describe('Simulador NeuroMath', () => {
  it('detecta divergencia cuando la tasa de aprendizaje es excesiva', () => {
    const result = evaluateNeuroMath({ lr: 0.25, reg: 0.02, layers: 4, optimizer: 'adam' });
    expect(result.generalization).toContain('Divergencia');
    expect(result.isSuccess).toBe(false);
  });

  it('detecta subajuste cuando la tasa de aprendizaje es demasiado baja', () => {
    const result = evaluateNeuroMath({ lr: 0.005, reg: 0.02, layers: 4, optimizer: 'adam' });
    expect(result.generalization).toContain('Subajuste');
    expect(result.isSuccess).toBe(false);
  });

  it('detecta sobreajuste severo con muchas capas y baja regularización', () => {
    const result = evaluateNeuroMath({ lr: 0.06, reg: 0.005, layers: 7, optimizer: 'adam' });
    expect(result.generalization).toContain('Sobreajuste');
    expect(result.isSuccess).toBe(false);
  });

  it('aprueba la simulación con hiperparámetros balanceados', () => {
    const result = evaluateNeuroMath({ lr: 0.05, reg: 0.025, layers: 4, optimizer: 'adam' });
    expect(result.isSuccess).toBe(true);
    expect(result.accuracy).toBeGreaterThanOrEqual(88);
    expect(result.generalization).toContain('Excelente');
  });
});

describe('Simulador Latido Social', () => {
  it('rechaza asignaciones que excedan las 100 unidades del fondo', () => {
    const result = evaluateSocialImpact({ infra: 50, mediation: 40, eco: 30, governance: 'participative' });
    expect(result.error).toBe('EXCEEDED_BUDGET');
    expect(result.isSuccess).toBe(false);
  });

  it('evalúa favorablemente una distribución equilibrada con gobernanza participativa', () => {
    const result = evaluateSocialImpact({ infra: 30, mediation: 35, eco: 35, governance: 'participative' });
    expect(result.error).toBeNull();
    expect(result.cohesion).toBeGreaterThanOrEqual(80);
    expect(result.environmental).toBeGreaterThanOrEqual(75);
    expect(result.equity).toBeGreaterThanOrEqual(78);
    expect(result.isSuccess).toBe(true);
  });

  it('penaliza la falta de mediación y gobernanza no participativa', () => {
    const result = evaluateSocialImpact({ infra: 80, mediation: 10, eco: 10, governance: 'centralized' });
    expect(result.isSuccess).toBe(false);
  });
});

describe('Simulador Gerencia+', () => {
  it('aplica efectos a las métricas respetando los límites clamp [10, 100]', () => {
    const initial = { velocity: 50, morale: 70, budget: 80 };
    const updated = applyGerenciaEffects(initial, { velocity: 60, morale: -90, budget: 10 });
    expect(updated.velocity).toBe(100);
    expect(updated.morale).toBe(10);
    expect(updated.budget).toBe(90);
  });
});
