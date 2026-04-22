import React, { useMemo, useState } from 'react';
import { Button, Card, cx, Segmented } from '../../ui';
import { navigate } from '../../router';

export default function NewComplaint({ onSubmit }) {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const remaining = useMemo(() => Math.max(0, 500 - (description || '').length), [description]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      title: subject,
      category: category || 'Facility Maintenance',
      priority: urgency === 'high' ? 'High' : urgency === 'low' ? 'Low' : 'Medium',
      status: 'Pending',
      description,
    };
    await onSubmit(payload);
    navigate('/student/dashboard');
  };

  return (
    <div className="sc-center">
      <div className="sc-breadcrumbs">Dashboard &nbsp;&gt;&nbsp; Complaints &nbsp;&gt;&nbsp; <strong>New Complaint</strong></div>

      <Card className="sc-formCard">
        <div className="sc-formCard__header">
          <h1 className="sc-h2">Raise New Complaint</h1>
          <p className="sc-subtitle">Fill in the details below so our maintenance team can assist you efficiently.</p>
        </div>

        <form className="sc-form" onSubmit={submit}>
          <label className="sc-field">
            <div className="sc-label">Complaint Category</div>
            <select className="sc-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a Category</option>
              <option value="Facility Maintenance">Facility Maintenance</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Hostel">Hostel</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="sc-field">
            <div className="sc-label">Subject / Title</div>
            <input
              className="sc-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., WiFi not working in Room 302"
              required
            />
          </label>

          <label className="sc-field">
            <div className="sc-label">Detailed Description</div>
            <textarea
              className="sc-input sc-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Please describe the issue in detail..."
              rows={5}
            />
            <div className="sc-helpRow">
              <span />
              <span className="sc-counter">{remaining}/500 characters</span>
            </div>
          </label>

          <div className="sc-field">
            <div className="sc-label">Urgency Level</div>
            <div className="sc-urgency">
              <Segmented
                value={urgency}
                onChange={setUrgency}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />
              <div className="sc-urgency__tiles" aria-hidden="true">
                <div className={cx('sc-urgTile', urgency === 'low' && 'is-active')}>
                  <div className="sc-urgTile__icon">≋</div>
                  <div className="sc-urgTile__label">Low</div>
                </div>
                <div className={cx('sc-urgTile', urgency === 'medium' && 'is-active')}>
                  <div className="sc-urgTile__icon">▮▮▮</div>
                  <div className="sc-urgTile__label">Medium</div>
                </div>
                <div className={cx('sc-urgTile', urgency === 'high' && 'is-active')}>
                  <div className="sc-urgTile__icon">!</div>
                  <div className="sc-urgTile__label">High</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sc-field">
            <div className="sc-label">Attachments (Optional)</div>
            <div className="sc-dropzone">
              <div className="sc-dropzone__icon">☁︎</div>
              <div className="sc-dropzone__text">
                <span className="sc-link">Upload a file</span> or drag and drop
              </div>
              <div className="sc-dropzone__hint">PNG, JPG, PDF up to 5MB</div>
            </div>
          </div>

          <div className="sc-actions">
            <Button variant="ghost" type="button" onClick={() => navigate('/student/dashboard')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Complaint <span className="sc-arrow">→</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


