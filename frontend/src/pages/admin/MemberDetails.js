import React, { useEffect, useState } from 'react';
import { navigate } from '../../router';
import { deleteMember, fetchMember, memberPhotoSrc, updateMember } from './memberApi';
import MemberForm from './MemberForm';

export default function MemberDetails({ memberId, startInEdit = false }) {
  const [member, setMember] = useState(null);
  const [editing, setEditing] = useState(startInEdit);
  const [error, setError] = useState('');
  const isAdmin = window.location.hash.startsWith('#/admin');
  const basePath = isAdmin ? '/admin/team-members' : '/student/team-members';

  useEffect(() => {
    setEditing(startInEdit);
  }, [startInEdit, memberId]);

  useEffect(() => {
    (async () => {
      try {
        setMember(await fetchMember(memberId));
      } catch (e) {
        setError('Failed to load member details');
      }
    })();
  }, [memberId]);

  if (error) return <div className="sc-errorText">{error}</div>;
  if (!member) return <div className="sc-loading">Loading…</div>;

  if (editing) {
    const initial = {
      ...member,
      hobbies: Array.isArray(member.hobbies) ? member.hobbies.join(', ') : member.hobbies || '',
      profilePhoto: null,
    };
    return (
      <div className="sc-stack sc-stack--lg">
        <div className="sc-row sc-row--between">
          <h2 className="sc-h2">Edit Member</h2>
          <button className="sc-btn sc-btn--secondary sc-btn--md" onClick={() => setEditing(false)}>Cancel</button>
        </div>
        <MemberForm
          initialValue={initial}
          submitLabel="Update Member"
          onSubmit={async (value) => {
            await updateMember(memberId, value);
            navigate(`${basePath}/list`);
          }}
        />
      </div>
    );
  }

  const handleDelete = async () => {
    const ok = window.confirm(`Delete ${member.name} from the team roster?`);
    if (!ok) return;
    await deleteMember(memberId);
    navigate(`${basePath}/list`);
  };

  const hobbies = Array.isArray(member.hobbies) ? member.hobbies.filter(Boolean) : [];

  return (
    <div className="sc-memberProfile sc-stack sc-stack--lg">
      <div className="sc-memberProfile__toolbar">
        <button className="sc-btn sc-btn--secondary sc-btn--md" onClick={() => navigate(`${basePath}/list`)}>
          Back
        </button>
        {isAdmin ? (
          <div className="sc-row">
            <button className="sc-btn sc-btn--primary sc-btn--md" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="sc-btn sc-btn--secondary sc-btn--md" onClick={handleDelete}>
              Delete
            </button>
          </div>
        ) : null}
      </div>
      <div className="sc-memberProfile__card">
        {member.profilePhotoUrl ? (
          <img
            src={memberPhotoSrc(member.profilePhotoUrl)}
            alt={member.name}
            className="sc-memberProfile__photo"
          />
        ) : (
          <div className="sc-memberProfile__photo sc-memberProfile__photo--placeholder">
            <span>{String(member.name || '?').slice(0, 1).toUpperCase()}</span>
          </div>
        )}
        <div className="sc-memberProfile__identity">
          <div className="sc-memberProfile__name">{member.name}</div>
          <div className="sc-memberProfile__course">{member.degree} - {member.year}</div>
        </div>
        <div className="sc-memberProfile__rows">
          <div className="sc-memberProfile__row">
            <span className="sc-memberProfile__label">Roll Number:</span>
            <span className="sc-memberProfile__value">{member.rollNumber}</span>
          </div>
          <div className="sc-memberProfile__row">
            <span className="sc-memberProfile__label">Project:</span>
            <span className="sc-memberProfile__value">{member.aboutProject || '-'}</span>
          </div>
          <div className="sc-memberProfile__row">
            <span className="sc-memberProfile__label">Certificate:</span>
            <span className="sc-memberProfile__value">{member.certificate}</span>
          </div>
          <div className="sc-memberProfile__row">
            <span className="sc-memberProfile__label">Internship:</span>
            <span className="sc-memberProfile__value">{member.internship}</span>
          </div>
          <div className="sc-memberProfile__row sc-memberProfile__row--stack">
            <span className="sc-memberProfile__label">About Your Aim:</span>
            <span className="sc-memberProfile__value">{member.aboutAim}</span>
          </div>
          <div className="sc-memberProfile__hobbies">
            <div className="sc-memberProfile__hobbiesTitle">Hobbies:</div>
            <div className="sc-memberProfile__chips">
              {hobbies.length ? hobbies.map((hobby) => (
                <span className="sc-memberProfile__chip" key={hobby}>
                  {hobby}
                </span>
              )) : <span className="sc-memberProfile__value">-</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
