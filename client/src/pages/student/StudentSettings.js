import React, { useMemo, useState } from 'react';
import { Badge, Button, Card, cx, Segmented } from '../../ui';

function toneForStatus(s) {
  const v = (s || '').toLowerCase();
  if (v === 'resolved') return 'success';
  if (v === 'in progress') return 'warning';
  if (v === 'pending' || v === 'open') return 'danger';
  return 'neutral';
}

export default function StudentSettings({ complaints, onUpdateComplaint }) {
  const resolved = useMemo(() => (complaints || []).filter((c) => String(c.status || '').toLowerCase() === 'resolved').slice().reverse(), [complaints]);
  const [selectedId, setSelectedId] = useState(resolved[0]?.id || null);
  const selected = resolved.find((c) => c.id === selectedId) || null;
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('5');
  const [msg, setMsg] = useState('');

  const loadSelected = (c) => {
    setSelectedId(c.id);
    setFeedback(String(c.feedback || ''));
    setRating(c.rating ? String(c.rating) : '5');
    setMsg('');
  };

  return (
    <div className="sc-stack sc-stack--lg">
      <div className="sc-pageHeader">
        <div>
          <h1 className="sc-h1">Student Settings</h1>
          <p className="sc-subtitle">Share feedback on resolved issues and update your preferences.</p>
        </div>
      </div>

      <div className="sc-2col sc-2col--wide">
        <Card title="Resolved Issues" action={<span className="sc-muted">{resolved.length} total</span>}>
          <div className="sc-table sc-table--full">
            <div className="sc-table__head">
              <div className="sc-table__row sc-table__row--head sc-table__row--cols sc-cols--queue">
                <div className="sc-table__cell">Ticket</div>
                <div className="sc-table__cell">Title</div>
                <div className="sc-table__cell">Status</div>
                <div className="sc-table__cell">Feedback</div>
                <div className="sc-table__cell sc-table__cell--right">Rating</div>
              </div>
            </div>
            <div className="sc-table__body">
              {resolved.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={cx('sc-table__row', 'sc-table__row--btn', 'sc-table__row--cols', 'sc-cols--queue', selectedId === c.id && 'is-tinted')}
                  onClick={() => loadSelected(c)}
                >
                  <div className="sc-table__cell sc-ticket">#CMP-{String(c.id).padStart(3, '0')}</div>
                  <div className="sc-table__cell">{c.title}</div>
                  <div className="sc-table__cell">
                    <Badge tone={toneForStatus(c.status)}>{c.status}</Badge>
                  </div>
                  <div className="sc-table__cell sc-muted">{c.feedback ? 'Submitted' : 'Pending'}</div>
                  <div className="sc-table__cell sc-table__cell--right">
                    <Badge tone="neutral">{c.rating ? `${c.rating}/5` : '—'}</Badge>
                  </div>
                </button>
              ))}
              {!resolved.length ? <div className="sc-empty">No resolved issues yet.</div> : null}
            </div>
          </div>
        </Card>

        <Card title="Resolved Issue Feedback" action={selected ? <Badge tone="success">#CMP-{String(selected.id).padStart(3, '0')}</Badge> : null}>
          {!selected ? (
            <div className="sc-muted">Select a resolved complaint to provide feedback.</div>
          ) : (
            <div className="sc-stack">
              <div>
                <div className="sc-strong">{selected.title}</div>
                <div className="sc-muted sc-sm">{selected.category}</div>
              </div>

              <div className="sc-field">
                <div className="sc-label">Rating</div>
                <Segmented
                  value={rating}
                  onChange={(v) => {
                    setRating(v);
                    setMsg('');
                  }}
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' }
                  ]}
                />
              </div>

              <label className="sc-field">
                <div className="sc-label">Feedback</div>
                <textarea
                  className="sc-input sc-textarea"
                  rows={5}
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    setMsg('');
                  }}
                  placeholder="Was the issue resolved satisfactorily? Any suggestions?"
                />
              </label>

              {msg ? <div className={cx('sc-empty', msg.startsWith('✅') ? 'sc-textSuccess' : 'sc-textDanger')}>{msg}</div> : null}

              <div className="sc-actions">
                <Button
                  variant="primary"
                  onClick={async () => {
                    setMsg('');
                    const r = Math.max(1, Math.min(5, Number(rating)));
                    try {
                      await onUpdateComplaint(selected.id, { feedback: String(feedback || ''), rating: r });
                      setMsg('✅ Feedback saved. Thank you!');
                    } catch {
                      setMsg('❌ Failed to save feedback.');
                    }
                  }}
                >
                  Save Feedback
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card title="General Preferences">
        <div className="sc-muted">
          Typical student settings include: notification preferences, contact info, and post-resolution feedback.
          This demo focuses on feedback submission to support continuous improvement.
        </div>
      </Card>
    </div>
  );
}

