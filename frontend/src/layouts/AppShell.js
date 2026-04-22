import React from 'react';
import { cx, Icon } from '../ui';
import { navigate } from '../router';

function NavItem({ icon, label, to, active, badge }) {
  return (
    <a
      href={`#${to}`}
      className={cx('sc-nav__item', active && 'is-active')}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      <span className="sc-nav__icon">
        <Icon name={icon} />
      </span>
      <span className="sc-nav__label">{label}</span>
      {badge ? <span className="sc-nav__badge">{badge}</span> : null}
    </a>
  );
}

export function Sidebar({ mode, currentPath, onLogout, userName, userSub }) {
  const isStudent = mode === 'student';
  const items = isStudent
    ? [
        { icon: 'grid', label: 'Dashboard', to: '/student/dashboard' },
        { icon: 'list', label: 'My Complaints', to: '/student/complaints' },
        { icon: 'plus', label: 'Submit Complaint', to: '/student/complaints/new' },
        { icon: 'users', label: 'Team Members', to: '/student/team-members' },
        { icon: 'book', label: 'Tutorials', to: '/tutorials' },
        { icon: 'grid', label: 'Lab Exercises', to: '/exercises' },
        { icon: 'settings', label: 'Settings', to: '/student/settings' },
      ]
    : [
        { icon: 'grid', label: 'Dashboard', to: '/admin/dashboard' },
        { icon: 'list', label: 'Complaints', to: '/admin/complaints' },
        { icon: 'users', label: 'Student Management', to: '/admin/student-management' },
        { icon: 'users', label: 'Team Members', to: '/admin/team-members' },
        { icon: 'refresh-cw', label: 'Operations', to: '/admin/operations' },
        { icon: 'tool', label: 'Campus Tools', to: '/admin/campus-tools' },
        { icon: 'settings', label: 'Settings', to: '/admin/settings' },
      ];

  return (
    <aside className="sc-sidebar">
      <div className="sc-sidebar__brand" onClick={() => navigate(isStudent ? '/student/dashboard' : '/admin/dashboard')}>
        <div className="sc-brand__mark">{isStudent ? <span className="sc-brand__cap" /> : <span className="sc-brand__cap" />}</div>
        <div className="sc-brand__name">{isStudent ? 'SmartCampus' : 'SmartCampus Admin'}</div>
      </div>

      <nav className="sc-nav">
        {items.map((it) => (
          <NavItem key={it.to} {...it} active={currentPath.startsWith(it.to)} />
        ))}
      </nav>

      {isStudent ? (
        <div className="sc-sidebar__footer">
          <div className="sc-user">
            <div className="sc-user__avatar">A</div>
            <div className="sc-user__meta">
              <div className="sc-user__name">{userName || 'Student'}</div>
              <div className="sc-user__sub">{userSub || ''}</div>
            </div>
          </div>
          <button
            className="sc-logout"
            type="button"
            onClick={() => {
              if (onLogout) onLogout();
              navigate('/login');
            }}
          >
            <span className="sc-logout__label">Logout</span>
            <span className="sc-logout__icon">
              <Icon name="logout" />
            </span>
          </button>
        </div>
      ) : (
        <div className="sc-sidebar__footer">
          <button
            className="sc-logout"
            type="button"
            onClick={() => {
              if (onLogout) onLogout();
              navigate('/login');
            }}
          >
            <span className="sc-logout__label">Logout</span>
            <span className="sc-logout__icon">
              <Icon name="logout" />
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}

export function Topbar({ left, right }) {
  return (
    <header className="sc-topbar">
      <div className="sc-topbar__left">{left}</div>
      <div className="sc-topbar__right">{right}</div>
    </header>
  );
}

export function AppShell({ mode, currentPath, topbarLeft, topbarRight, onLogout, userName, userSub, children }) {
  return (
    <div className="sc-app">
      <Sidebar mode={mode} currentPath={currentPath} onLogout={onLogout} userName={userName} userSub={userSub} />
      <div className="sc-main">
        <Topbar left={topbarLeft} right={topbarRight} />
        <div className="sc-page">{children}</div>
      </div>
    </div>
  );
}
