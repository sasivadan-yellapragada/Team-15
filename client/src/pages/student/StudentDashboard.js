import React, { useMemo } from 'react';
import { Button, Card, Icon, StatCard } from '../../ui';
import { navigate } from '../../router';

function statusCounts(complaints) {
  const counts = { total: complaints.length, open: 0, inProgress: 0, resolved: 0 };
  for (const c of complaints) {
    const s = (c.status || '').toLowerCase();
    if (s === 'resolved') counts.resolved += 1;
    else if (s === 'in progress') counts.inProgress += 1;
    else counts.open += 1;
  }
  return counts;
}

export default function StudentDashboard({ complaints, userName }) {
  const counts = useMemo(() => statusCounts(complaints || []), [complaints]);
  const recent = (complaints || []).slice().reverse().slice(0, 4);
  const name = String(userName || '').trim() || 'Student';

  return (
    <div className="sc-stack sc-stack--xl">
      <div className="sc-pageHeader">
        <div>
          <h1 className="sc-h1">
            Welcome back, {name}! <span aria-hidden="true">👋</span>
          </h1>
          <p className="sc-subtitle">Here’s what’s happening with your campus requests today.</p>
        </div>
        <Button variant="primary" leftIcon={<Icon name="plus" />} onClick={() => navigate('/student/complaints/new')}>
          Raise New Complaint
        </Button>
      </div>

      <div className="sc-grid sc-grid--stats">
        <StatCard label="Total Complaints" value={counts.total} hint="Lifetime submissions" rightIcon={<span className="sc-miniIcon">📋</span>} />
        <StatCard
          label="Open"
          value={counts.open}
          hint={<span className="sc-pill sc-pill--danger">Action Required ▲</span>}
          rightIcon={<span className="sc-miniIcon">⚠️</span>}
        />
        <StatCard
          label="In Progress"
          value={counts.inProgress}
          hint={<span className="sc-pill sc-pill--warning">SLA: 4h left</span>}
          rightIcon={<span className="sc-miniIcon">⏳</span>}
        />
        <StatCard
          label="Resolved"
          value={counts.resolved}
          hint={<span className="sc-pill sc-pill--success">75% resolution rate</span>}
          rightIcon={<span className="sc-miniIcon">✅</span>}
        />
      </div>

      <Card
        title="Recent Complaints"
        action={
          <a
            className="sc-link"
            href="#/student/complaints"
            onClick={(e) => {
              e.preventDefault();
              navigate('/student/complaints');
            }}
          >
            View All
          </a>
        }
      >
        <div className="sc-table">
          <div className="sc-table__head">
            <div className="sc-table__row sc-table__row--head">
              <div className="sc-table__cell">Ticket ID</div>
            </div>
          </div>
          <div className="sc-table__body">
            {recent.map((c) => (
              <button key={c.id} className="sc-table__row sc-table__row--btn" type="button" onClick={() => navigate(`/student/complaints/${c.id}`)}>
                <div className="sc-table__cell">
                  <span className="sc-ticket">#CMP-2023-{String(c.id).padStart(3, '0')}</span>
                </div>
              </button>
            ))}
            {!recent.length ? <div className="sc-empty">No complaints yet.</div> : null}
          </div>
        </div>
      </Card>

      <div className="sc-help">
        <div className="sc-help__icon">🛟</div>
        <div className="sc-help__text">
          <div className="sc-help__title">Need immediate help?</div>
          <div className="sc-help__sub">Contact the Campus emergency hotline for urgent safety</div>
        </div>
        <a className="sc-link" href="#/student/help" onClick={(e) => e.preventDefault()}>
          View Emergency Contacts
        </a>
      </div>
    </div>
  );
}


