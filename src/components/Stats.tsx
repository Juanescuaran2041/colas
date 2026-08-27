import type { EngineSnapshot } from '../logic/types';

interface StatsProps {
  snapshot: EngineSnapshot;
}

function Stats({ snapshot }: StatsProps) {
  const stats: Array<{ label: string; value: string }> = [
    { label: 'Tiempo', value: `${snapshot.time.toFixed(1)}s` },
    { label: 'Procesados', value: String(snapshot.processed) },
    { label: 'Descartados', value: String(snapshot.dropped) },
    { label: 'Bloqueos', value: String(snapshot.blockedTicks) },
    { label: 'Pico de cola', value: String(snapshot.peak) },
  ];

  return (
    <div className="stats-panel">
      <h2>Estadísticas</h2>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
