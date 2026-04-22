import { useEffect, useMemo, useState } from 'react';

function normalizeHash(hash) {
  const raw = (hash || '').replace(/^#/, '');
  if (!raw) return '/student/dashboard';
  if (raw.startsWith('/')) return raw;
  return `/${raw}`;
}

export function useHashRoute() {
  const [path, setPath] = useState(() => normalizeHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setPath(normalizeHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = useMemo(() => {
    const segments = path.split('/').filter(Boolean);
    return { path, segments };
  }, [path]);

  return route;
}

export function navigate(to) {
  window.location.hash = normalizeHash(to);
}


