import Controls from './components/Controls';
import EventLog from './components/EventLog';
import QueueSlots from './components/QueueSlots';
import Stats from './components/Stats';
import { useBackpressureEngine } from './hooks/useBackpressureEngine';
import './App.css';

function App() {
  const { snapshot, logs, start, pause, reset, setParam } = useBackpressureEngine();

  return (
    <section id="app">
      <header id="app-header">
        <h1>Simulador de Backpressure</h1>
        <p>Ajusta la producción, el consumo y la estrategia para ver cómo reacciona la cola.</p>
      </header>

      <div id="app-layout">
        <div id="app-main">
          <QueueSlots
            queue={snapshot.queue}
            capacity={snapshot.capacity}
            producerBlocked={snapshot.producerBlocked}
          />
          <Stats snapshot={snapshot} />
          <EventLog logs={logs} />
        </div>

        <aside id="app-sidebar">
          <Controls
            snapshot={snapshot}
            onStart={start}
            onPause={pause}
            onReset={() => reset()}
            onParamChange={setParam}
          />
        </aside>
      </div>
    </section>
  );
}

export default App;
