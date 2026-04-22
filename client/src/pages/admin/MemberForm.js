import React, { useMemo, useState } from 'react';
import { memberPhotoSrc, validateMember } from './memberApi';

const base = {
  name: '',
  rollNumber: '',
  year: '',
  degree: '',
  aboutProject: '',
  profilePhoto: null,
  profilePhotoUrl: '',
  hobbies: '',
  certificate: '',
  internship: '',
  aboutAim: '',
};

export default function MemberForm({ initialValue, onSubmit, submitLabel }) {
  const [value, setValue] = useState(initialValue || base);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const selectedFileName = value.profilePhoto instanceof File ? value.profilePhoto.name : 'No file chosen';

  const setField = (k, v) => setValue((p) => ({ ...p, [k]: v }));
  const previewUrl = useMemo(() => {
    if (value.profilePhoto instanceof File) return URL.createObjectURL(value.profilePhoto);
    return memberPhotoSrc(value.profilePhotoUrl);
  }, [value.profilePhoto, value.profilePhotoUrl]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const msg = validateMember(value);
    if (msg) return setError(msg);
    setSaving(true);
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sc-memberFormShell">
      <form className="sc-memberForm" onSubmit={submit}>
        <h2 className="sc-memberForm__title">{submitLabel === 'Update Member' ? 'Update Team Member' : 'Add Team Member'}</h2>
        {[
          ['name', 'Name'],
          ['rollNumber', 'Roll Number'],
          ['year', 'Year'],
          ['degree', 'Degree'],
        ].map(([k, placeholder]) => (
          <div className="sc-field" key={k}>
            <input
              className="sc-input sc-memberForm__input"
              placeholder={placeholder}
              value={value[k]}
              onChange={(e) => setField(k, e.target.value)}
            />
          </div>
        ))}
        <div className="sc-field">
          <textarea
            className="sc-input sc-textarea sc-memberForm__input"
            rows={4}
            placeholder="About Project"
            value={value.aboutProject}
            onChange={(e) => setField('aboutProject', e.target.value)}
          />
        </div>
        <div className="sc-field">
          <input
            className="sc-input sc-memberForm__input"
            placeholder="Hobbies (comma separated)"
            value={value.hobbies}
            onChange={(e) => setField('hobbies', e.target.value)}
          />
        </div>
        <div className="sc-field">
          <input
            className="sc-input sc-memberForm__input"
            placeholder="Certificate"
            value={value.certificate}
            onChange={(e) => setField('certificate', e.target.value)}
          />
        </div>
        <div className="sc-field">
          <input
            className="sc-input sc-memberForm__input"
            placeholder="Internship"
            value={value.internship}
            onChange={(e) => setField('internship', e.target.value)}
          />
        </div>
        {previewUrl ? (
          <div className="sc-field sc-memberForm__preview">
            <img
              src={previewUrl}
              alt={`${value.name || 'Team member'} preview`}
              className="sc-memberPhoto sc-memberPhoto--lg"
            />
          </div>
        ) : null}
        <div className="sc-field">
          <textarea
            className="sc-input sc-textarea sc-memberForm__input"
            rows={4}
            placeholder="About Your Aim"
            value={value.aboutAim}
            onChange={(e) => setField('aboutAim', e.target.value)}
          />
        </div>
        <div className="sc-field">
          <label className="sc-memberForm__file" htmlFor="member-profile-photo">
            <span className="sc-memberForm__fileBtn">Browse</span>
            <span className="sc-memberForm__fileName">{selectedFileName}</span>
            <input
              id="member-profile-photo"
              className="sc-memberForm__fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => setField('profilePhoto', e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {error ? <div className="sc-errorText">{error}</div> : null}
        <div className="sc-actions sc-memberForm__actions">
          <button className="sc-btn sc-btn--primary sc-btn--md sc-memberForm__submit" type="submit" disabled={saving}>
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
