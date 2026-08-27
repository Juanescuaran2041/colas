import type { EngineSnapshot, MutableParam, Strategy } from '../logic/types';

interface ControlsProps {
  snapshot: EngineSnapshot;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onParamChange: (key: MutableParam, value: number | Strategy) => void;
}

const STRATEGY_OPTIONS: Array<{ value: Strategy; label: string }> = [
  { value: 'block', label: 'Bloquear productor' },
  { value: 'drop_new', label: 'Descartar nuevo' },
  { value: 'drop_old', label: 'Descartar antiguo' },
  { value: 'priority', label: 'Prioridad (preserva críticos)' },
];

function Controls({ snapshot, onStart, onPause, onReset, onParamChange }: ControlsProps) {
  return (
    <div className="controls-panel">
      <h2>Controles</h2>

      <div className="controls-buttons">
        <button type="button" onClick={onStart} disabled={snapshot.running}>
          Iniciar
        </button>
        <button type="button" onClick={onPause} disabled={!snapshot.running}>
          Pausar
        </button>
        <button type="button" onClick={onReset}>
          Reiniciar
        </button>
      </div>

      <label className="control-field">
        <span>
          Capacidad de cola <strong>{snapshot.capacity}</strong>
        </span>
        <input
          type="range"
          min={1}
          max={50}
          value={snapshot.capacity}
          onChange={(e) => onParamChange('capacity', Number(e.target.value))}
        />
      </label>

      <label className="control-field">
        <span>
          Tasa de producción <strong>{snapshot.producerRate}/s</strong>
        </span>
        <input
          type="range"
          min={0}
          max={20}
          value={snapshot.producerRate}
          onChange={(e) => onParamChange('producerRate', Number(e.target.value))}
        />
      </label>

      <label className="control-field">
        <span>
          Tasa de consumo <strong>{snapshot.consumerRate}/s</strong>
        </span>
        <input
          type="range"
          min={0}
          max={20}
          value={snapshot.consumerRate}
          onChange={(e) => onParamChange('consumerRate', Number(e.target.value))}
        />
      </label>

      <label className="control-field">
        <span>Estrategia de backpressure</span>
        <select
          value={snapshot.strategy}
          onChange={(e) => onParamChange('strategy', e.target.value as Strategy)}
        >
          {STRATEGY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default Controls;
