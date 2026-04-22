import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, cx } from '../../ui';

function toneForPriority(p) {
  const v = (p || '').toLowerCase();
  if (v === 'critical' || v === 'high') return 'danger';
  if (v === 'medium') return 'warning';
  if (v === 'low') return 'success';
  return 'neutral';
}

function toneForStatus(s) {
  const v = (s || '').toLowerCase();
  if (v === 'resolved') return 'success';
  if (v === 'in progress') return 'warning';
  if (v === 'pending' || v === 'open') return 'danger';
  return 'neutral';
}

export default function AdminComplaints({ complaints, staff, onAssignComplaint, onUpdateComplaint, onAddUpdate }) {
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [dept, setDept] = useState('All');

  const available = useMemo(() => (staff || []).filter((m) => m.status === 'free'), [staff]);

  const filtered = useMemo(() => {
    return (complaints || []).filter((c) => {
      const catOk = category === 'All' || c.category === category;
      const priOk = priority === 'All' || c.priority === priority;
      const deptOk = dept === 'All' || (c.department || 'All') === dept;
      return catOk && priOk && deptOk;
    });
  }, [complaints, category, priority, dept]);

  return (
    <div className="sc-stack sc-stack--lg">
      <div className="sc-adminStats">
        <div className="sc-adminStat">
          <div className="sc-adminStat__label">Total Open</div>
          <div className="sc-adminStat__value">{filtered.filter((c) => (c.status || '').toLowerCase() !== 'resolved').length}</div>
        </div>
        <div className="sc-adminStat">
          <div className="sc-adminStat__label">Breaching SLA</div>
          <div className="sc-adminStat__value">
            <span className="sc-textDanger">{Math.min(8, filtered.length)}</span>
          </div>
        </div>
        <div className="sc-adminStat">
          <div className="sc-adminStat__label">Resolved Today</div>
          <div className="sc-adminStat__value sc-textSuccess">42</div>
        </div>
        <div className="sc-adminStat">
          <div className="sc-adminStat__label">Avg Resolution</div>
          <div className="sc-adminStat__value">4.5h</div>
        </div>
      </div>

      <Card
        title="Complaint Management"
        action={<div className="sc-muted">Manage and track student reported issues</div>}
        className="sc-adminCard"
      >
        <div className="sc-filters">
          <Button variant="chip" className={cx('sc-chip', category !== 'All' && 'is-active')} onClick={() => setCategory(category === 'All' ? 'Infrastructure' : 'All')}>
            Category: {category}
          </Button>
          <Button variant="chip" className={cx('sc-chip', priority !== 'All' && 'is-active')} onClick={() => setPriority(priority === 'All' ? 'High' : 'All')}>
            Priority: {priority}
          </Button>
          <Button variant="chip" className={cx('sc-chip', dept !== 'All' && 'is-active')} onClick={() => setDept(dept === 'All' ? 'Maintenance' : 'All')}>
            Dept: {dept}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setCategory('All');
              setPriority('All');
              setDept('All');
            }}
          >
            Reset ↻
          </Button>
        </div>

        <div className="sc-table sc-table--full sc-table--scroll">
          <div className="sc-table__head">
            <div className="sc-table__row sc-table__row--head sc-table__row--cols sc-cols--adminComplaints">
              <div className="sc-table__cell">ID</div>
              <div className="sc-table__cell">Title</div>
              <div className="sc-table__cell">Dept</div>
              <div className="sc-table__cell">Assigned</div>
              <div className="sc-table__cell">Priority</div>
              <div className="sc-table__cell">Status</div>
              <div className="sc-table__cell">Feedback</div>
              <div className="sc-table__cell">Rating</div>
              <div className="sc-table__cell sc-table__cell--right">Actions</div>
            </div>
          </div>
          <div className="sc-table__body">
            {filtered.slice(0, 6).map((c) => (
              <div key={c.id} className={cx('sc-table__row', 'sc-table__row--cols', 'sc-cols--adminComplaints', c.priority === 'Critical' && 'is-tinted')}>
                <div className="sc-table__cell">
                  <span className="sc-ticket">#CMP-23-{String(380 + c.id)}</span>
                  <div className="sc-muted sc-sm">{c.date}</div>
                </div>
                <div className="sc-table__cell">{c.title}</div>
                <div className="sc-table__cell">
                  <select
                    className="sc-input sc-input--compact"
                    value={c.department || 'Maintenance'}
                    onChange={(e) => onUpdateComplaint(c.id, { department: e.target.value })}
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Hostel">Hostel</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="sc-table__cell">
                  <Badge tone={c.assignedTo ? 'success' : 'neutral'}>{c.assignedTo ? c.assignedTo : 'Unassigned'}</Badge>
                </div>
                <div className="sc-table__cell">
                  <Badge tone={toneForPriority(c.priority)}>{c.priority}</Badge>
                </div>
                <div className="sc-table__cell">
                  <Badge tone={toneForStatus(c.status)}>{c.status}</Badge>
                </div>
                <div className="sc-table__cell sc-muted">{c.feedback ? String(c.feedback).slice(0, 42) + (String(c.feedback).length > 42 ? '…' : '') : '—'}</div>
                <div className="sc-table__cell">
                  <Badge tone="neutral">{c.rating ? `${c.rating}/5` : '—'}</Badge>
                </div>
                <div className="sc-table__cell sc-table__cell--right">
                  <div className="sc-adminActions">
                    <select
                      className="sc-input sc-input--compact"
                      value={String(c.status || 'Pending')}
                      onChange={(e) => onUpdateComplaint(c.id, { status: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <select
                      className="sc-input sc-input--compact"
                      value=""
                      onChange={(e) => {
                        const id = e.target.value;
                        const m = (available || []).find((x) => x._id === id);
                        if (m && onAssignComplaint) onAssignComplaint(c.id, m);
                      }}
                      disabled={!available.length}
                    >
                      <option value="">{available.length ? 'Assign…' : 'No free staff'}</option>
                      {available.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <div className="sc-row" style={{ justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={() => onUpdateComplaint(c.id, { status: 'Resolved' })}>
                        Mark Resolved ✓
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={async () => {
                          const msg = window.prompt('Add note to student (shows in Updates & Activity):');
                          if (!msg) return;
                          if (onAddUpdate) await onAddUpdate(c.id, msg);
                        }}
                      >
                        Add Note ✎
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!filtered.length ? <div className="sc-empty">No complaints found.</div> : null}
          </div>
        </div>

        <div className="sc-pagination">
          <div className="sc-muted sc-sm">Showing 1 to {Math.min(6, filtered.length)} of {filtered.length} results</div>
          <div className="sc-pager">
            <button className="sc-pageBtn" type="button">
              ‹
            </button>
            <button className="sc-pageBtn is-active" type="button">
              1
            </button>
            <button className="sc-pageBtn" type="button">
              2
            </button>
            <button className="sc-pageBtn" type="button">
              3
            </button>
            <span className="sc-muted">…</span>
            <button className="sc-pageBtn" type="button">
              12
            </button>
            <button className="sc-pageBtn" type="button">
              ›
            </button>
            <select className="sc-select" defaultValue="10">
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}


