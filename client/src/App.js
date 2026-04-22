import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { useHashRoute } from './router';
import { AppShell } from './layouts/AppShell';
import { Icon } from './ui';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentComplaints from './pages/student/StudentComplaints';
import NewComplaint from './pages/student/NewComplaint';
import ComplaintDetail from './pages/student/ComplaintDetail';
import StudentSettings from './pages/student/StudentSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import UIKit from './pages/UIKit';
import Tutorials from './pages/Tutorials';
import Exercises from './pages/Exercises';
import StudentManagement from './pages/StudentManagement';
import Operations from './pages/Operations';
import CampusTools from './pages/CampusTools';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminSettings from './pages/admin/AdminSettings';
import TeamMembersHome from './pages/admin/TeamMembersHome';
import AddMember from './pages/admin/AddMember';
import ViewMembers from './pages/admin/ViewMembers';
import MemberDetails from './pages/admin/MemberDetails';

function findComplaintById(complaints, id) {
  const n = Number(id);
  return (complaints || []).find((c) => Number(c.id) === n);
}

function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem('sc_session') || 'null');
  } catch {
    return null;
  }
}

function readTheme() {
  try {
    const v = String(window.localStorage.getItem('sc_theme') || '').trim();
    return v === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function App() {
  const { path, segments } = useHashRoute();
  const mode = segments[0] === 'admin' ? 'admin' : segments[0] === 'ui' ? 'ui' : 'student';

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [session, setSession] = useState(() => readSession());
  const [theme, setTheme] = useState(() => readTheme());

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    window.localStorage.setItem('sc_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Keep session in sync with localStorage (Login writes there)
    setSession(readSession());
  }, [path]);

  const fetchComplaints = async (nextSession) => {
    const s = nextSession || session;
    const isStudent = s?.role === 'student';
    const query = isStudent ? `?ownerId=${encodeURIComponent(String(s?.id || ''))}` : '';
    const res = await fetch(`/api/complaints${query}`);
    const data = await res.json();
    return data.data || [];
  };

  const fetchStaff = async () => {
    const res = await fetch('/api/staff');
    const data = await res.json();
    return data.data || [];
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const next = await fetchComplaints();
        if (!ignore) setComplaints(next);
        const s = await fetchStaff();
        if (!ignore) setStaff(s);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(async () => {
      try {
        const next = await fetchComplaints();
        setComplaints(next);
        const s = await fetchStaff();
        setStaff(s);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }, 10000);
    return () => window.clearInterval(intervalId);
  }, []);

  const onSubmitComplaint = async (payload) => {
    try {
      const enriched = {
        ...payload,
        createdById: String(session?.id || ''),
        createdByEmail: String(session?.email || ''),
        createdByName: String(session?.name || ''),
      };
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched),
      });
      const result = await response.json();
      setComplaints((prev) => [...prev, result.data]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const onUpdateComplaint = async (id, patch) => {
    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const result = await response.json();
      if (result?.data) {
        setComplaints((prev) => prev.map((item) => (item.id === id ? result.data : item)));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const onUpdateStaff = async (id, patch) => {
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const result = await response.json();
      if (result?.data) {
        setStaff((prev) => prev.map((s) => (s._id === id ? result.data : s)));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const onAssignComplaint = async (complaintId, staffMember) => {
    if (!staffMember) return;
    await onUpdateComplaint(complaintId, {
      assignedTo: staffMember.name,
      assignedToId: staffMember._id,
      assignedAt: new Date().toISOString(),
      status: 'In Progress',
    });
    await onUpdateStaff(staffMember._id, { status: 'busy', currentComplaintId: complaintId });
  };

  const onAddComplaintUpdate = async (complaintId, message) => {
    const payload = {
      authorRole: session?.role || 'system',
      authorName: session?.name || (session?.role === 'admin' ? 'Admin' : 'Student'),
      message,
    };
    const response = await fetch(`/api/complaints/${complaintId}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result?.data) {
      setComplaints((prev) => prev.map((item) => (item.id === complaintId ? result.data : item)));
    }
  };

  const logout = () => {
    window.localStorage.removeItem('sc_session');
    setSession(null);
  };

  const topbarRight = useMemo(() => {
    const themeToggle = (
      <button
        className="sc-iconBtn"
        type="button"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
    );

    if (mode === 'admin') {
      return (
        <div className="sc-topRight">
          <div className="sc-search">
            <input className="sc-search__input" placeholder="Global search (Students, Complaints, Staff)..." />
          </div>
          {themeToggle}
          <button className="sc-iconBtn" type="button" aria-label="Notifications">
            <Icon name="bell" />
          </button>
          <div className="sc-userChip">
            <div className="sc-userChip__meta">
              <div className="sc-userChip__name">{session?.name || 'Admin'}</div>
              <div className="sc-userChip__sub">{session?.email || ''}</div>
            </div>
            <div className="sc-userChip__avatar">{String(session?.name || 'A').slice(0, 2).toUpperCase()}</div>
          </div>
        </div>
      );
    }
    if (mode === 'student') {
      return (
        <div className="sc-topRight">
          {themeToggle}
          <button className="sc-iconBtn" type="button" aria-label="Notifications">
            <Icon name="bell" />
          </button>
          <div className="sc-userChip">
            <div className="sc-userChip__meta">
              <div className="sc-userChip__name">{session?.name || 'Student'}</div>
              <div className="sc-userChip__sub">{session?.email || ''}</div>
            </div>
            <div className="sc-userChip__avatar">{String(session?.name || 'S').slice(0, 2).toUpperCase()}</div>
          </div>
        </div>
      );
    }
    return null;
  }, [mode, session, theme]);

  if (loading) return <div className="sc-loading">Loading…</div>;

  if (mode === 'ui') {
    return (
      <div className="sc-uiOnly">
        <UIKit />
      </div>
    );
  }

  // Auth pages (always accessible)
  if (path.startsWith('/login')) {
    return (
      <Login
        onLogin={(next) => {
          setSession(next);
          (async () => {
            const nextComplaints = await fetchComplaints(next);
            setComplaints(nextComplaints);
          })();
        }}
      />
    );
  }
  if (path.startsWith('/signup')) {
    return <Signup />;
  }

  // Protect app routes
  const isAuthed = Boolean(session && session.role);
  if (!isAuthed) {
    window.location.hash = '#/login';
    return null;
  }
  if (mode === 'admin' && session.role !== 'admin') {
    window.location.hash = '#/login';
    return null;
  }
  if (mode !== 'admin' && session.role !== 'student') {
    window.location.hash = '#/login';
    return null;
  }

  const topbarLeft = mode === 'admin' ? <div className="sc-topTitle"> </div> : <div className="sc-topTitle"> </div>;

  let content = null;
  if (mode === 'admin') {
    if (path.startsWith('/admin/student-management')) content = <StudentManagement />;
    else if (path.startsWith('/admin/team-members/add')) content = <AddMember />;
    else if (path.startsWith('/admin/team-members/list')) content = <ViewMembers />;
    else if (path.startsWith('/admin/team-members/') && segments[2] && segments[3] === 'edit') content = <MemberDetails memberId={segments[2]} startInEdit />;
    else if (path.startsWith('/admin/team-members/') && segments[2]) content = <MemberDetails memberId={segments[2]} />;
    else if (path.startsWith('/admin/team-members')) content = <TeamMembersHome />;
    else if (path.startsWith('/admin/operations')) content = <Operations />;
    else if (path.startsWith('/admin/campus-tools')) content = <CampusTools />;
    else if (path.startsWith('/admin/settings')) content = <AdminSettings />;
    else if (path.startsWith('/admin/complaints'))
      content = (
        <AdminComplaints
          complaints={complaints}
          staff={staff}
          onAssignComplaint={onAssignComplaint}
          onUpdateComplaint={onUpdateComplaint}
          onAddUpdate={onAddComplaintUpdate}
        />
      );
    else content = <AdminDashboard complaints={complaints} staff={staff} onAssignComplaint={onAssignComplaint} onUpdateComplaint={onUpdateComplaint} onUpdateStaff={onUpdateStaff} />;
  } else {
    if (path.startsWith('/tutorials')) content = <Tutorials />;
    else if (path.startsWith('/exercises')) content = <Exercises />;
    else if (path.startsWith('/student/team-members/add')) content = <AddMember />;
    else if (path.startsWith('/student/team-members/list')) content = <ViewMembers />;
    else if (path.startsWith('/student/team-members/') && segments[2] && segments[3] === 'edit') content = <MemberDetails memberId={segments[2]} startInEdit />;
    else if (path.startsWith('/student/team-members/') && segments[2]) content = <MemberDetails memberId={segments[2]} />;
    else if (path.startsWith('/student/team-members')) content = <TeamMembersHome />;
    else if (path.startsWith('/student/complaints/new')) content = <NewComplaint onSubmit={onSubmitComplaint} />;
    else if (path.startsWith('/student/settings')) content = <StudentSettings complaints={complaints} onUpdateComplaint={onUpdateComplaint} />;
    else if (path.startsWith('/student/complaints/') && segments[2]) {
      content = (
        <ComplaintDetail
          complaint={findComplaintById(complaints, segments[2])}
          onUpdateComplaint={onUpdateComplaint}
          onAddUpdate={onAddComplaintUpdate}
        />
      );
    } else if (path.startsWith('/student/complaints')) content = <StudentComplaints complaints={complaints} />;
    else content = <StudentDashboard complaints={complaints} userName={session?.name} />;
  }

  return (
    <AppShell mode={mode} currentPath={path} topbarLeft={topbarLeft} topbarRight={topbarRight} onLogout={logout} userName={session?.name} userSub={session?.email}>
      {content}
    </AppShell>
  );
}
