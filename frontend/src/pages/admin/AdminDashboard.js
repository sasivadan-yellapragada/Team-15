import React, { useMemo } from 'react';
import { Badge, Button, Card, StatCard } from '../../ui';
import { navigate } from '../../router';

function toneForPriority(p) {
  const v = (p || '').toLowerCase();
  if (v === 'critical' || v === 'high') return 'danger';
  if (v === 'medium') return 'warning';
  if (v === 'low') return 'success';
  return 'neutral';
}

function toneForStaffStatus(s) {
  return s === 'free' ? 'success' : s === 'busy' ? 'warning' : 'neutral';
}

export default function AdminDashboard({ complaints, staff, onAssignComplaint, onUpdateStaff }) {
  const stats = useMemo(() => {
    const rows = complaints || [];
    let open = 0;
    let inProgress = 0;
    let resolved = 0;
    for (const c of rows) {
      const s = String(c.status || '').toLowerCase();
      if (s === 'resolved') resolved += 1;
      else if (s === 'in progress') inProgress += 1;
      else open += 1;
    }
    const free = (staff || []).filter((m) => m.status === 'free').length;
    const busy = (staff || []).filter((m) => m.status === 'busy').length;
    return { total: rows.length, open, inProgress, resolved, free, busy };
  }, [complaints, staff]);

  const queue = useMemo(() => {
    const rows = (complaints || []).slice().reverse();
    return rows.slice(0, 8);
  }, [complaints]);

  const available = useMemo(() => (staff || []).filter((m) => m.status === 'free'), [staff]);

  return (
    <div className="sc-adminDash">
      <div className="sc-adminDash__header">
        <h1 className="sc-h1">Dashboard Overview</h1>
        <div className="sc-adminDash__actions">
          <Button variant="primary" onClick={() => navigate('/admin/complaints')}>
            Open Complaint Management →
          </Button>
        </div>
      </div>

      <div className="sc-grid sc-grid--stats">
        <StatCard label="Total Complaints" value={stats.total} hint="All student submissions" rightIcon={<span className="sc-miniIcon">🗂</span>} />
        <StatCard label="Open / Pending" value={stats.open} hint={<span className="sc-pill sc-pill--danger">Needs action</span>} rightIcon={<span className="sc-miniIcon">⚠️</span>} />
        <StatCard label="In Progress" value={stats.inProgress} hint="Assigned & being worked" rightIcon={<span className="sc-miniIcon">⏳</span>} />
        <StatCard label="Resolved" value={stats.resolved} hint={<span className="sc-pill sc-pill--success">Completed</span>} rightIcon={<span className="sc-miniIcon">✅</span>} />
      </div>

      <div className="sc-2col sc-2col--wide">
        <div className="sc-stack sc-stack--lg">
          <Card
            title="Workforce Availability"
            action={
              <span className="sc-muted">
                <Badge tone="success">{stats.free} Free</Badge>&nbsp; <Badge tone="warning">{stats.busy} Working</Badge>
              </span>
            }
          >
            <div className="sc-table sc-table--full">
              <div className="sc-table__head">
                <div className="sc-table__row sc-table__row--head sc-table__row--cols sc-cols--workforce">
                  <div className="sc-table__cell">Name</div>
                  <div className="sc-table__cell">Department</div>
                  <div className="sc-table__cell">Role</div>
                  <div className="sc-table__cell">Status</div>
                  <div className="sc-table__cell sc-table__cell--right">Update</div>
                </div>
              </div>
              <div className="sc-table__body">
                {(staff || []).slice(0, 8).map((m) => (
                  <div key={m._id} className="sc-table__row sc-table__row--cols sc-cols--workforce">
                    <div className="sc-table__cell">{m.name}</div>
                    <div className="sc-table__cell">{m.department}</div>
                    <div className="sc-table__cell">{m.role}</div>
                    <div className="sc-table__cell">
                      <Badge tone={toneForStaffStatus(m.status)}>{m.status}</Badge>
                    </div>
                    <div className="sc-table__cell sc-table__cell--right">
                      <select
                        className="sc-input sc-input--compact"
                        value={m.status}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (onUpdateStaff) onUpdateStaff(m._id, next === 'free' ? { status: 'free', currentComplaintId: null } : { status: 'busy' });
                        }}
                      >
                        <option value="free">free</option>
                        <option value="busy">busy</option>
                      </select>
                    </div>
                  </div>
                ))}
                {!staff?.length ? <div className="sc-empty">No staff found.</div> : null}
              </div>
            </div>
          </Card>

          <Card title="Complaint Queue (Assign Staff)">
            <div className="sc-table sc-table--full">
              <div className="sc-table__head">
                <div className="sc-table__row sc-table__row--head sc-table__row--cols sc-cols--queue">
                  <div className="sc-table__cell">ID</div>
                  <div className="sc-table__cell">Title</div>
                  <div className="sc-table__cell">Priority</div>
                  <div className="sc-table__cell">Status</div>
                  <div className="sc-table__cell">Assigned</div>
                  <div className="sc-table__cell sc-table__cell--right">Assign to</div>
                </div>
              </div>
              <div className="sc-table__body">
                {queue.map((c) => {
                  const assigned = c.assignedTo ? c.assignedTo : 'Unassigned';
                  return (
                    <div key={c.id} className="sc-table__row sc-table__row--cols sc-cols--queue">
                      <div className="sc-table__cell sc-ticket">#CMP-{String(c.id).padStart(3, '0')}</div>
                      <div className="sc-table__cell">{c.title}</div>
                      <div className="sc-table__cell">
                        <Badge tone={toneForPriority(c.priority)}>{c.priority}</Badge>
                      </div>
                      <div className="sc-table__cell">
                        <select
                          className="sc-input sc-input--compact"
                          value={String(c.status || 'Pending')}
                          onChange={(e) => {
                            // Admin dashboard quick status updates
                            // eslint-disable-next-line no-console
                            if (typeof window !== 'undefined' && window.fetch) {
                              fetch(`/api/complaints/${c.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: e.target.value })
                              }).catch(() => {});
                            }
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                      <div className="sc-table__cell">
                        <Badge tone={c.assignedTo ? 'success' : 'neutral'}>{assigned}</Badge>
                      </div>
                      <div className="sc-table__cell sc-table__cell--right">
                        <select
                          className="sc-input sc-input--compact"
                          value=""
                          onChange={(e) => {
                            const id = e.target.value;
                            const m = (available || []).find((x) => x._id === id);
                            if (m) onAssignComplaint(c.id, m);
                          }}
                          disabled={!available.length}
                        >
                          <option value="">{available.length ? 'Assign staff…' : 'No free staff'}</option>
                          {available.map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.name} ({m.department})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
                {!queue.length ? <div className="sc-empty">No complaints found.</div> : null}
              </div>
            </div>
          </Card>
        </div>

        <Card title="Tips" action={<span className="sc-muted">Workflow</span>}>
          <div className="sc-muted">
            Assign free staff to pending complaints, and update staff status when they become available again.
          </div>
        </Card>
      </div>

    </div>
  );
}


