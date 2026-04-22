import React, { useEffect, useState } from 'react';
import { navigate } from '../../router';
import { deleteMember, fetchMembers, memberPhotoSrc } from './memberApi';

export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const isAdmin = window.location.hash.startsWith('#/admin');
  const basePath = isAdmin ? '/admin/team-members' : '/student/team-members';

  useEffect(() => {
    (async () => {
      try {
        setMembers(await fetchMembers());
      } catch (e) {
        setError('Failed to load members');
      }
    })();
  }, []);

  const handleDelete = async (member) => {
    const ok = window.confirm(`Delete ${member.name} from the team roster?`);
    if (!ok) return;

    try {
      await deleteMember(member._id);
      setMembers((current) => current.filter((item) => item._id !== member._id));
      setError('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete member');
    }
  };

  return (
    <div className="sc-teamGallery sc-stack sc-stack--lg">
      <div className="sc-teamGallery__header">
        <h2 className="sc-teamGallery__title">MEET OUR AMAZING TEAM</h2>
      </div>

      {error ? <div className="sc-errorText">{error}</div> : null}
      {!error && !members.length ? <div className="sc-teamGallery__empty">No team members found.</div> : null}
      <div className="sc-teamGallery__grid">
        {members.map((m) => (
          <div className="sc-teamGallery__card" key={m._id}>
            {m.profilePhotoUrl ? (
              <img
                src={memberPhotoSrc(m.profilePhotoUrl)}
                alt={m.name}
                className="sc-teamGallery__photo"
              />
            ) : (
              <div className="sc-teamGallery__photo sc-teamGallery__photo--placeholder">
                <span>{String(m.name || '?').slice(0, 1).toUpperCase()}</span>
              </div>
            )}
            <div className="sc-teamGallery__body">
              <div className="sc-teamGallery__name">{m.name}</div>
              <div className="sc-teamGallery__meta">Roll Number: {m.rollNumber}</div>
              <div className="sc-teamGallery__submeta">{m.degree} {m.year ? `• ${m.year}` : ''}</div>
              <button className="sc-btn sc-btn--primary sc-btn--md sc-teamGallery__viewBtn" onClick={() => navigate(`${basePath}/${m._id}`)}>
                View Details
              </button>
              {isAdmin ? (
                <div className="sc-teamGallery__adminLinks">
                  <button className="sc-teamGallery__linkBtn" onClick={() => navigate(`${basePath}/${m._id}/edit`)}>
                    Edit
                  </button>
                  <button className="sc-teamGallery__linkBtn sc-teamGallery__linkBtn--danger" onClick={() => handleDelete(m)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
