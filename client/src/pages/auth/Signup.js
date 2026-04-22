import React, { useState } from 'react';
import { Button, Card, cx, Segmented } from '../../ui';
import { navigate } from '../../router';

export default function Signup() {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');

    const nm = String(name || '').trim();
    const mail = String(email || '').trim().toLowerCase();
    const pwd = String(password || '');

    if (!nm || !mail || !pwd) {
      setError('Please fill all fields.');
      return;
    }
    if (pwd.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (pwd !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setBusy(true);
      const res = await fetch(`/api/auth/${role}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nm, email: mail, password: pwd })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Signup failed');
        return;
      }
      setOk('Account created in MongoDB. Please login.');
      window.setTimeout(() => navigate('/login'), 700);
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
            <h1 className="sc-h2">Signup</h1>
            <p className="sc-subtitle">Create a Student/Admin account (saved in MongoDB).</p>
          </div>

          <form className="sc-form" onSubmit={onSubmit}>
            <div className="sc-field">
              <div className="sc-label">Create account as</div>
              <Segmented
                value={role}
                onChange={(v) => {
                  setRole(v);
                  setError('');
                  setOk('');
                }}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'admin', label: 'Admin' }
                ]}
              />
            </div>

            <label className="sc-field">
              <div className="sc-label">Full name</div>
              <input className="sc-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" />
            </label>

            <label className="sc-field">
              <div className="sc-label">Email</div>
              <input className="sc-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </label>

            <label className="sc-field">
              <div className="sc-label">Password</div>
              <input className="sc-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>

            <label className="sc-field">
              <div className="sc-label">Confirm password</div>
              <input className="sc-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
            </label>

            {error ? <div className={cx('sc-empty', 'sc-textDanger')}>{error}</div> : null}
            {ok ? <div className={cx('sc-empty', 'sc-textSuccess')}>{ok}</div> : null}

            <div className="sc-actions">
              <Button variant="ghost" type="button" onClick={() => navigate('/login')} disabled={busy}>
                Back to Login
              </Button>
              <Button variant="primary" type="submit" disabled={busy}>
                Create Account <span className="sc-arrow">→</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

