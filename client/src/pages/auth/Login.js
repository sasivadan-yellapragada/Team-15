import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, cx, Segmented } from '../../ui';
import { navigate } from '../../router';

function writeSession(session) {
  window.localStorage.setItem('sc_session', JSON.stringify(session));
}

export default function Login({ onLogin }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const helper = useMemo(() => {
    if (role === 'admin') {
      return (
        <div className="sc-muted sc-sm">
          Use your admin credentials (stored in MongoDB).
        </div>
      );
    }
    return (
      <div className="sc-muted sc-sm">
        New user?{' '}
        <a
          className="sc-link"
          href="#/signup"
          onClick={(e) => {
            e.preventDefault();
            navigate('/signup');
          }}
        >
          Create account
        </a>
      </div>
    );
  }, [role]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const mail = String(email || '').trim().toLowerCase();
    const pwd = String(password || '');

    if (!mail || !pwd) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setBusy(true);
      const res = await fetch(`/api/auth/${role}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mail, password: pwd })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Login failed');
        return;
      }

      const session = { role: data.data.role, ...data.data.user };
      writeSession(session);
      if (onLogin) onLogin(session);
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (e2) {
      setError('Unable to contact server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sc-authPage">
      <div className="sc-center">
      <Card className="sc-formCard">
        <div className="sc-formCard__header">
          <h1 className="sc-h2">Login</h1>
          <p className="sc-subtitle">Choose your role and sign in to continue.</p>
        </div>

        <form className="sc-form" onSubmit={onSubmit}>
          <div className="sc-field">
            <div className="sc-label">Login as</div>
            <Segmented
              value={role}
              onChange={(v) => {
                setRole(v);
                setError('');
              }}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
          </div>

          <label className="sc-field">
            <div className="sc-label">Email</div>
            <input className="sc-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </label>

          <label className="sc-field">
            <div className="sc-label">Password</div>
            <input className="sc-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>

          {error ? <div className={cx('sc-empty', 'sc-textDanger')}>{error}</div> : null}

          <div className="sc-row sc-row--between">
            <span />
            <a
              className="sc-link"
              href="#/login"
              onClick={(e) => {
                e.preventDefault();
                setShowReset((v) => !v);
                setResetMsg('');
                setError('');
              }}
            >
              Forgot password?
            </a>
          </div>

          {showReset ? (
            <div className="sc-resetBox">
              <div className="sc-strong">Reset password (demo)</div>
              <div className="sc-muted sc-sm">Updates your password in MongoDB for the selected role.</div>

              <label className="sc-field" style={{ marginTop: 10 }}>
                <div className="sc-label">Email</div>
                <input className="sc-input" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="name@example.com" />
              </label>

              <label className="sc-field">
                <div className="sc-label">New password</div>
                <input className="sc-input" type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="••••••••" />
              </label>

              {resetMsg ? <div className={cx('sc-empty', resetMsg.startsWith('✅') ? 'sc-textSuccess' : 'sc-textDanger')}>{resetMsg}</div> : null}

              <div className="sc-actions">
                <Button
                  variant="secondary"
                  type="button"
                  disabled={busy}
                  onClick={async () => {
                    setResetMsg('');
                    const mail = String(resetEmail || '').trim().toLowerCase();
                    const pwd = String(resetPassword || '');
                    if (!mail || !pwd) {
                      setResetMsg('❌ Enter email and new password.');
                      return;
                    }
                    try {
                      setBusy(true);
                      const res = await fetch(`/api/auth/${role}/reset-password`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: mail, password: pwd })
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setResetMsg(`❌ ${data?.message || 'Reset failed'}`);
                        return;
                      }
                      setResetMsg('✅ Password updated. Now login.');
                      setEmail(mail);
                      setPassword(pwd);
                    } catch {
                      setResetMsg('❌ Unable to contact server.');
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Update Password
                </Button>
              </div>
            </div>
          ) : null}

          <div className="sc-actions">
            <Button variant="ghost" type="button" onClick={() => navigate('/login')} disabled={busy}>
              Reset
            </Button>
            <Button variant="primary" type="submit" disabled={busy}>
              Login <span className="sc-arrow">→</span>
            </Button>
          </div>

          {helper}
        </form>
      </Card>
      </div>
    </div>
  );
}

