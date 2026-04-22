import React, { useMemo } from 'react';
import { Badge, Button, Card, Icon } from '../../ui';
import { navigate } from '../../router';

function toneForStatus(s) {
  const v = (s || '').toLowerCase();
  if (v === 'resolved') return 'success';
  if (v === 'in progress') return 'warning';
  if (v === 'pending' || v === 'open') return 'danger';
  return 'neutral';
}

export default function StudentComplaints({ complaints }) {
  const rows = useMemo(() => (complaints || []).slice().reverse(), [complaints]);

  return (
    <div className="sc-stack sc-stack--lg">
      <div className="sc-pageHeader">
        <div>
          <h1 className="sc-h1">My Complaints</h1>
          <p className="sc-subtitle">Track, update, and review your submitted requests.</p>
        </div>
        <Button variant="primary" leftIcon={<Icon name="plus" />} onClick={() => navigate('/student/complaints/new')}>
          Raise New Complaint
        </Button>
      </div>

      <Card title="Recent Complaints">
        <div className="sc-table sc-table--full">
          <div className="sc-table__head">
            <div className="sc-table__row sc-table__row--head sc-table__row--cols">
              <div className="sc-table__cell">Ticket</div>
              <div className="sc-table__cell">Title</div>
              <div className="sc-table__cell">Category</div>
              <div className="sc-table__cell">Status</div>
              <div className="sc-table__cell sc-table__cell--right">Date</div>
            </div>
          </div>
          <div className="sc-table__body">
            {rows.map((c) => (
              <button key={c.id} className="sc-table__row sc-table__row--btn sc-table__row--cols" type="button" onClick={() => navigate(`/student/complaints/${c.id}`)}>
                <div className="sc-table__cell">
                  <span className="sc-ticket">#CMP-2023-{String(c.id).padStart(3, '0')}</span>
                </div>
                <div className="sc-table__cell">{c.title}</div>
                <div className="sc-table__cell">{c.category}</div>
                <div className="sc-table__cell">
                  <Badge tone={toneForStatus(c.status)}>{c.status}</Badge>
                </div>
                <div className="sc-table__cell sc-table__cell--right sc-muted">{c.date}</div>
              </button>
            ))}
            {!rows.length ? <div className="sc-empty">No complaints yet.</div> : null}
          </div>
        </div>
      </Card>
    </div>
  );
}


