import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, cx, Segmented } from '../../ui';

export default function AdminSettings() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('Maintenance');
  const [newRole, setNewRole] = useState('Technician');
  const [newStatus, setNewStatus] = useState('free');

  const [resetRole, setResetRole] = useState('admin');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const refreshStaff = async () => {
    setError('');
    setOk('');
    setLoading(true);
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load staff');
      setStaff(data.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refreshStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const free = (staff || []).filter((m) => m.status === 'free').length;
    const busy = (staff || []).filter((m) => m.status === 'busy').length;
    return { total: (staff || []).length, free, busy };
  }, [staff]);

  return (
    <div className="sc-stack sc-stack--lg">
      <div className="sc-pageHeader">
        <div>
          <h1 className="sc-h1">Admin Settings</h1>
          <p className="sc-subtitle">Manage workforce, security, and system preferences.</p>
        </div>
      </div>

      {error ? <div className={cx('sc-empty', 'sc-textDanger')}>{error}</div> : null}
      {ok ? <div className={cx('sc-empty', 'sc-textSuccess')}>{ok}</div> : null}

      <div className="sc-2col sc-2col--wide">
        <Card
          title="Workforce Management"
          action={
            <span className="sc-muted">
              <Badge tone="neutral">{stats.total} Total</Badge>&nbsp; <Badge tone="success">{stats.free} Free</Badge>&nbsp; <Badge tone="warning">{stats.busy} Busy</Badge>
            </span>
          }
        >
          <div className="sc-row sc-row--between">
            <div className="sc-muted sc-sm">Add / remove staff and keep availability updated.</div>
            <Button variant="secondary" size="sm" onClick={refreshStaff} disabled={loading}>
              Refresh
            </Button>
          </div>

          <div className="sc-stack" style={{ marginTop: 12 }}>
            <div className="sc-row">
              <input className="sc-input" placeholder="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <select className="sc-input" value={newDept} onChange={(e) => setNewDept(e.target.value)}>
                <option value="Maintenance">Maintenance</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="IT Support">IT Support</option>
                <option value="Hostel">Hostel</option>
              </select>
              <input className="sc-input" placeholder="Role (e.g., Technician)" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
              <select className="sc-input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="free">free</option>
                <option value="busy">busy</option>
              </select>
              <Button
                variant="primary"
                size="sm"
                onClick={async () => {
                  setError('');
                  setOk('');
                  const name = String(newName || '').trim();
                  if (!name) {
                    setError('Staff name is required.');
                    return;
                  }
                  try {
                    setLoading(true);
                    const res = await fetch('/api/staff', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, department: newDept, role: newRole, status: newStatus })
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data?.message || 'Failed to add staff');
                    setStaff((prev) => [...prev, data.data]);
                    setNewName('');
                    setOk('Staff added.');
                  } catch (e) {
                    setError(e.message || 'Failed to add staff');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                Add
              </Button>
            </div>

            <div className="sc-table sc-table--full">
              <div className="sc-table__head">
                <div className="sc-table__row sc-table__row--head sc-table__row--cols sc-cols--workforce">
                  <div className="sc-table__cell">Name</div>
                  <div className="sc-table__cell">Department</div>
                  <div className="sc-table__cell">Role</div>
                  <div className="sc-table__cell">Status</div>
                  <div className="sc-table__cell sc-table__cell--right">Remove</div>
                </div>
              </div>
              <div className="sc-table__body">
                {staff.map((m) => (
                  <div key={m._id} className="sc-table__row sc-table__row--cols sc-cols--workforce">
                    <div className="sc-table__cell">{m.name}</div>
                    <div className="sc-table__cell">{m.department}</div>
                    <div className="sc-table__cell">{m.role}</div>
                    <div className="sc-table__cell">
                      <Badge tone={m.status === 'free' ? 'success' : 'warning'}>{m.status}</Badge>
                    </div>
                    <div className="sc-table__cell sc-table__cell--right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          setError('');
                          setOk('');
                          try {
                            setLoading(true);
                            const res = await fetch(`/api/staff/${m._id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data?.message || 'Failed to delete');
                            setStaff((prev) => prev.filter((x) => x._id !== m._id));
                            setOk('Staff deleted.');
                          } catch (e) {
                            setError(e.message || 'Failed to delete staff');
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {!staff.length ? <div className="sc-empty">No staff found.</div> : null}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Security: Reset Password" action={<span className="sc-muted">Demo</span>}>
          <div className="sc-muted sc-sm">Reset a Student/Admin account password (MongoDB). No email OTP in this demo.</div>

          <div className="sc-field" style={{ marginTop: 12 }}>
            <div className="sc-label">Account type</div>
            <Segmented
              value={resetRole}
              onChange={(v) => {
                setResetRole(v);
                setResetMsg('');
              }}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'student', label: 'Student' }
              ]}
            />
          </div>

          <label className="sc-field">
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
              variant="primary"
              onClick={async () => {
                setResetMsg('');
                const mail = String(resetEmail || '').trim().toLowerCase();
                const pwd = String(resetPassword || '');
                if (!mail || !pwd) {
                  setResetMsg('❌ Enter email and new password.');
                  return;
                }
                try {
                  setLoading(true);
                  const res = await fetch(`/api/auth/${resetRole}/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: mail, password: pwd })
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setResetMsg(`❌ ${data?.message || 'Reset failed'}`);
                    return;
                  }
                  setResetMsg('✅ Password updated.');
                } catch {
                  setResetMsg('❌ Unable to contact server.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              Reset Password
            </Button>
          </div>
        </Card>
      </div>

      <Card title="General Settings">
        <div className="sc-muted">
          Typical admin settings include: notification rules, default departments, SLA targets, user role policies, and audit logs.
          This section can be extended as needed.
        </div>
      </Card>
    </div>
  );
}

