import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, Icon } from '../../ui';

function toneForPriority(p) {
  const v = (p || '').toLowerCase();
  if (v === 'critical' || v === 'high') return 'danger';
  if (v === 'medium') return 'warning';
  if (v === 'low') return 'success';
  return 'neutral';
}

function StatusStep({ label, active, done }) {
  return (
    <div className="sc-step">
      <div className={['sc-step__dot', done ? 'is-done' : '', active ? 'is-active' : ''].filter(Boolean).join(' ')}>
        {done ? '✓' : label[0]}
      </div>
      <div className={['sc-step__label', active ? 'is-active' : ''].filter(Boolean).join(' ')}>{label}</div>
    </div>
  );
}

function fmtWhen(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export default function ComplaintDetail({ complaint, onUpdateComplaint, onAddUpdate }) {
  const [updateText, setUpdateText] = useState('');

  const steps = useMemo(() => {
    const status = (complaint?.status || 'Submitted').toLowerCase();
    const order = ['Submitted', 'In Review', 'In Progress', 'Resolved'];
    const idx =
      status === 'resolved' ? 3 : status === 'in progress' ? 2 : status === 'in review' ? 1 : status === 'submitted' ? 0 : 2;
    return order.map((label, i) => ({ label, done: i < idx, active: i === idx }));
  }, [complaint]);

  if (!complaint) return null;
  const updates = (complaint.updates || []).slice().reverse();

  return (
    <div className="sc-stack sc-stack--lg">
      <div className="sc-detailTop">
        <div className="sc-breadcrumbs">
          Home &nbsp;&gt;&nbsp; Complaints &nbsp;&gt;&nbsp; <strong>#CMP-2023-{String(complaint.id).padStart(3, '0')}</strong>
        </div>
        <div className="sc-detailActions">
          <Button variant="secondary" leftIcon={<Icon name="download" />}>
            Export PDF
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (onUpdateComplaint) await onUpdateComplaint(complaint.id, { status: 'Resolved' });
              if (onAddUpdate) await onAddUpdate(complaint.id, 'Complaint was closed by the student.');
            }}
          >
            Close Complaint ✓
          </Button>
        </div>
      </div>

      <h1 className="sc-h1">{complaint.title}</h1>

      <Card title="Current Status">
        <div className="sc-steps">
          {steps.map((s) => (
            <StatusStep key={s.label} {...s} />
          ))}
        </div>
        <div className="sc-row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
          <select
            className="sc-input sc-input--compact"
            value={String(complaint.status || 'Pending')}
            onChange={(e) => onUpdateComplaint && onUpdateComplaint(complaint.id, { status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </Card>

      <div className="sc-2col">
        <Card className="sc-detailCard">
          <div className="sc-detailBadges">
            <Badge tone="neutral">#CMP-2023-{String(complaint.id).padStart(3, '0')}</Badge>
            <Badge tone={toneForPriority(complaint.priority)}>{complaint.priority} Priority</Badge>
            <Badge tone="neutral">{complaint.category}</Badge>
          </div>

          <h3 className="sc-h3">Description</h3>
          <p className="sc-paragraph">
            {complaint.description ||
              'The air conditioning unit is making unusual noises and there may be an electrical hazard. Please address this urgently as the room is frequently used.'}
          </p>

          <h3 className="sc-h3">Attachments</h3>
          <div className="sc-attachments">
            <div className="sc-thumb" />
            <div className="sc-thumb" />
          </div>

          <div className="sc-assignee">
            <div className="sc-avatarLg">SJ</div>
            <div>
              <div className="sc-strong">Officer Sarah Jenkins</div>
              <div className="sc-muted">Facilities Manager</div>
              <div className="sc-muted sc-sm">Assigned to handle HVAC and plumbing related complaints.</div>
              <div className="sc-assignee__actions">
                <Button variant="secondary" size="sm">
                  Email ✉︎
                </Button>
                <Button variant="secondary" size="sm">
                  Call Office ☎︎
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Updates & Activity" action={<Badge tone="neutral">{updates.length} Updates</Badge>} className="sc-activity">
          <div className="sc-feed">
            {updates.map((u, idx) => (
              <div key={`${u.createdAt || idx}-${idx}`} className="sc-feedItem">
                <div className="sc-feedItem__head">
                  <div className="sc-strong">{u.authorName || 'System'}</div>
                  <div className="sc-muted sc-sm">{fmtWhen(u.createdAt)}</div>
                </div>
                <div className={u.authorRole === 'student' ? 'sc-bubble sc-bubble--muted' : 'sc-bubble'}>{u.message}</div>
              </div>
            ))}
            {!updates.length ? <div className="sc-empty">No updates yet.</div> : null}
          </div>

          <div className="sc-reply">
            <div className="sc-reply__row">
              <span className="sc-muted">📎</span>
              <input
                className="sc-input"
                placeholder="Type your update or reply here..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={async () => {
                const msg = String(updateText || '').trim();
                if (!msg) return;
                if (onAddUpdate) await onAddUpdate(complaint.id, msg);
                setUpdateText('');
              }}
            >
              Post Update
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}


