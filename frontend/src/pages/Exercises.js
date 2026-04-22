import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Button, Card, Badge } from '../ui';

/* ---------------- Ex 2a: Stateful class component ---------------- */
class StatefulCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState((s) => ({ count: s.count + 1 }));
  };

  reset = () => {
    this.setState({ count: 0 });
  };

  render() {
    return (
      <div className="sc-stack">
        <div className="sc-row sc-row--between">
          <div className="sc-strong">Count (state): {this.state.count}</div>
          <Badge tone="neutral">Class Component</Badge>
        </div>
        <div className="sc-row">
          <Button variant="primary" size="sm" onClick={this.increment}>
            Increment
          </Button>
          <Button variant="secondary" size="sm" onClick={this.reset}>
            Reset
          </Button>
        </div>
        <div className="sc-muted sc-sm">
          Output: The displayed count updates when you click Increment / Reset.
        </div>
      </div>
    );
  }
}

/* ---------------- Ex 2b: Stateless class component ---------------- */
class StatelessGreeting extends React.Component {
  render() {
    return (
      <div className="sc-stack">
        <div className="sc-strong">Hello, {this.props.name}!</div>
        <div className="sc-muted sc-sm">
          Output: Greeting is rendered purely from props (no internal state).
        </div>
      </div>
    );
  }
}

/* ---------------- Ex 3a: useState + useEffect ---------------- */
function HooksUseStateUseEffect() {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState('Running');

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.title = `Timer: ${seconds}s`;
    setStatus(seconds < 5 ? 'Warming up…' : 'Running');
  }, [seconds]);

  return (
    <div className="sc-stack">
      <div className="sc-row sc-row--between">
        <div className="sc-strong">Timer: {seconds}s</div>
        <Badge tone="success">Hooks</Badge>
      </div>
      <div className="sc-muted">Status: {status}</div>
      <div className="sc-muted sc-sm">
        Output: Timer increments every second (useEffect interval). Browser tab title updates on every tick.
      </div>
    </div>
  );
}

/* ---------------- Ex 3b: useContext + useReducer + useRef ---------------- */
const CounterCtx = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'inc':
      return { ...state, count: state.count + 1 };
    case 'dec':
      return { ...state, count: Math.max(0, state.count - 1) };
    case 'setName':
      return { ...state, name: action.value };
    default:
      return state;
  }
}

function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0, name: 'Alex' });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CounterCtx.Provider value={value}>{children}</CounterCtx.Provider>;
}

function CounterPanel() {
  const { state, dispatch } = useContext(CounterCtx);
  const inputRef = useRef(null);

  return (
    <div className="sc-stack">
      <div className="sc-row sc-row--between">
        <div className="sc-strong">
          {state.name}’s counter: {state.count}
        </div>
        <Badge tone="neutral">Context + Reducer</Badge>
      </div>

      <div className="sc-row">
        <Button variant="primary" size="sm" onClick={() => dispatch({ type: 'inc' })}>
          +1
        </Button>
        <Button variant="secondary" size="sm" onClick={() => dispatch({ type: 'dec' })}>
          -1
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (inputRef.current) inputRef.current.focus();
          }}
        >
          Focus name input (useRef)
        </Button>
      </div>

      <label className="sc-field">
        <div className="sc-label">Name (useRef + useReducer)</div>
        <input
          ref={inputRef}
          className="sc-input"
          value={state.name}
          onChange={(e) => dispatch({ type: 'setName', value: e.target.value })}
          placeholder="Enter a name"
        />
      </label>

      <div className="sc-muted sc-sm">
        Output: <br />
        - useContext shares state/dispatch across components <br />
        - useReducer updates count/name via actions <br />
        - useRef focuses the input without re-render logic
      </div>
    </div>
  );
}

function Exercise8ExpressFsDemo() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch('/tutorial/ex8/items');
      const j = await r.json();
      setItems(Array.isArray(j.data) ? j.data : []);
    } catch (e) {
      setErr(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const response = await fetch('/tutorial/ex8/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Demo item' }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setName('');
      await load();
    } catch (e) {
      setErr(e.message || 'Failed to add');
    }
  };

  return (
    <div className="sc-stack">
      <div className="sc-muted sc-sm">
        Backend: Express routes in <code>backend/server.js</code> (<code>GET/POST /tutorial/ex8/items</code>) read and write{' '}
        <code>backend/data/tutorial-ex8-items.json</code> using Node <code>fs</code> and <code>path</code>.
      </div>
      {err ? <div className="sc-textDanger sc-sm">{err}</div> : null}
      <form className="sc-row" onSubmit={add}>
        <input className="sc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <Button variant="primary" type="submit" disabled={loading}>
          POST item
        </Button>
        <Button variant="secondary" type="button" onClick={load} disabled={loading}>
          Refresh (GET)
        </Button>
      </form>
      <ul className="sc-muted sc-sm">
        {items.map((it) => (
          <li key={it.id}>
            #{it.id} — {it.name} <span className="sc-muted">({it.createdAt})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Exercises() {
  return (
    <div className="sc-center sc-stack sc-stack--xl">
      <div>
        <h1 className="sc-h1">MERN / React Lab Exercises</h1>
        <p className="sc-subtitle">
          These pages were added without changing your existing UI navigation. Open via route: <strong>#/exercises</strong>
        </p>
      </div>

      <Card title="Ex No: 1 — Setting up MERN environment (Steps)">
        <div className="sc-muted">
          See documentation file: <code>smart-campus-portal/docs/Ex1_MERN_environment_setup.md</code>
        </div>
      </Card>

      <Card title="Ex No: 2a — Stateful class component (Program + Output)">
        <StatefulCounter />
      </Card>

      <Card title="Ex No: 2b — Stateless class component (Program + Output)">
        <StatelessGreeting name="SmartCampus" />
      </Card>

      <Card title="Ex No: 3a — React hooks: useState + useEffect (Program + Output)">
        <HooksUseStateUseEffect />
      </Card>

      <Card title="Ex No: 3b — React hooks: useContext + useReducer + useRef (Program + Output)">
        <CounterProvider>
          <CounterPanel />
        </CounterProvider>
      </Card>

      <Card title="Ex No: 7 — Node.js based Web development (HTTP, fs, path, url — no Express)">
        <div className="sc-stack">
          <div className="sc-muted sc-sm">
            Implemented as a <strong>standalone</strong> Node server (not the main portal API). Uses only built-in modules.
          </div>
          <ul className="sc-muted sc-sm">
            <li>
              <strong>Code:</strong> <code>smart-campus-portal/nodejs-builtin-apis/server.js</code>
            </li>
            <li>
              <strong>Static UI:</strong> <code>nodejs-builtin-apis/public/</code> (served by the same server via <code>fs</code> +{' '}
              <code>path</code>)
            </li>
            <li>
              <strong>Data:</strong> <code>nodejs-builtin-apis/data/notes.json</code>
            </li>
            <li>
              <strong>Run:</strong> <code>cd nodejs-builtin-apis && npm start</code> (default port <strong>4000</strong>). If 4000 is already in use:{' '}
              <code>PORT=4001 npm start</code> → open{' '}
              <a href="http://localhost:4000" target="_blank" rel="noreferrer">
                http://localhost:4000
              </a>{' '}
              or{' '}
              <a href="http://localhost:4001" target="_blank" rel="noreferrer">
                http://localhost:4001
              </a>
            </li>
          </ul>
        </div>
      </Card>

      <Card title="Ex No: 8 — Express.js-based Web development (Express + fs + path + GET/POST)">
        <Exercise8ExpressFsDemo />
      </Card>
    </div>
  );
}

