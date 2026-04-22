import React from 'react';
import { navigate } from '../../router';

export default function TeamMembersHome() {
  const addPath = window.location.hash.startsWith('#/admin') ? '/admin/team-members/add' : '/student/team-members/add';
  const listPath = window.location.hash.startsWith('#/admin') ? '/admin/team-members/list' : '/student/team-members/list';

  return (
    <div className="sc-teamHome">
      <div className="sc-teamHome__hero">
        <h1 className="sc-teamHome__title">TEAM 15</h1>
        <p className="sc-teamHome__subtitle">Welcome to the Team 15 Management</p>
        <div className="sc-teamHome__card">
          <div className="sc-teamHome__cardTitle">Manage Team</div>
          <div className="sc-teamHome__actions">
            <button className="sc-teamHome__actionBtn" onClick={() => navigate(addPath)}>
              Add Member
            </button>
            <button className="sc-teamHome__actionBtn" onClick={() => navigate(listPath)}>
              View Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
