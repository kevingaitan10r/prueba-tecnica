/**
 * Funciones puras de cálculo y evaluación para los simuladores pedagógicos.
 * Desacopladas de la manipulación del DOM para permitir pruebas unitarias.
 */

/**
 * Evalúa los parámetros del modelo en el simulador de optimización NeuroMath.
 */
export function evaluateNeuroMath({ lr, reg, layers, optimizer }) {
  let accuracy = 70;
  let loss = 0.65;
  let generalization = 'Estable';
  let feedback = '';

  if (lr > 0.18) {
    accuracy = Math.max(45, Math.round(60 - (lr - 0.18) * 100));
    loss = 1.45;
    generalization = 'Divergencia (Gradiente Explosivo)';
    feedback = 'La tasa de aprendizaje es demasiado alta. El descenso de gradiente salta los mínimos y el modelo oscila sin converger.';
  } else if (lr < 0.015) {
    accuracy = 74;
    loss = 0.52;
    generalization = 'Subajuste (Underfitting)';
    feedback = 'Tasa de aprendizaje excesivamente baja. El modelo avanza con lentitud y no captura los patrones de los datos.';
  } else if (layers >= 6 && reg < 0.01) {
    accuracy = 94;
    loss = 0.12;
    generalization = 'Sobreajuste Severo (Overfitting)';
    feedback = 'Capacidad excesiva sin regularización suficiente: la red memoriza los datos de entrenamiento y pierde capacidad de generalización.';
  } else {
    const optBonus = optimizer === 'adam' ? 5 : (optimizer === 'rmsprop' ? 3 : 0);
    const regBonus = (reg >= 0.015 && reg <= 0.045) ? 6 : -2;
    const layerBonus = (layers >= 3 && layers <= 5) ? 4 : 0;
    accuracy = Math.min(97, 85 + optBonus + regBonus + layerBonus);
    loss = Number((0.24 - (accuracy - 85) * 0.008).toFixed(3));
    generalization = 'Excelente (Óptima Generalización)';
    feedback = 'Configuración óptima: convergencia controlada, balance entre sesgo y varianza con adecuada capacidad de generalización.';
  }

  const isSuccess = accuracy >= 88 && generalization.startsWith('Excelente');

  return {
    accuracy,
    loss,
    generalization,
    feedback,
    isSuccess
  };
}

/**
 * Evalúa la asignación presupuestal y el modelo de gobernanza en el simulador de impacto comunitario.
 */
export function evaluateSocialImpact({ infra, mediation, eco, governance }) {
  const total = infra + mediation + eco;

  if (total > 100) {
    return {
      error: 'EXCEEDED_BUDGET',
      total,
      cohesion: 0,
      environmental: 0,
      equity: 0,
      isSuccess: false,
      feedback: 'El presupuesto total asignado no puede exceder las 100 unidades del fondo.'
    };
  }

  const govBonusCohesion = governance === 'participative' ? 25 : (governance === 'delegated' ? 5 : -10);
  const govBonusEquity = governance === 'participative' ? 20 : (governance === 'delegated' ? 0 : -15);

  const cohesion = Math.min(98, Math.max(0, Math.round(mediation * 1.5 + infra * 0.4 + govBonusCohesion)));
  const environmental = Math.min(96, Math.max(0, Math.round(eco * 1.6 + infra * 0.5 + 10)));
  const equity = Math.min(95, Math.max(0, Math.round(mediation * 1.1 + infra * 0.8 + govBonusEquity)));

  const isSuccess = cohesion >= 80 && environmental >= 75 && equity >= 78;

  const feedback = isSuccess
    ? 'Distribución equilibrada: atiende infraestructura básica, fortalece el tejido comunitario y preserva la sostenibilidad ecológica bajo gobernanza participativa.'
    : 'El plan presenta desbalances. Se recomienda reforzar las mesas de concertación y la sostenibilidad ambiental bajo un modelo participativo.';

  return {
    error: null,
    total,
    cohesion,
    environmental,
    equity,
    isSuccess,
    feedback
  };
}

/**
 * Aplica los efectos de una decisión en el simulador de metodologías ágiles.
 */
export function applyGerenciaEffects(currentStats, effects) {
  const clamp = (val) => Math.max(10, Math.min(100, val));
  return {
    velocity: clamp(currentStats.velocity + (effects.velocity || 0)),
    morale: clamp(currentStats.morale + (effects.morale || 0)),
    budget: clamp(currentStats.budget + (effects.budget || 0))
  };
}
