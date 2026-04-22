import React from 'react';
import { navigate } from './router';

export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function Icon({ name }) {
  // Minimal inline icon set (monochrome). Add more as needed.
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (name) {
    case 'grid':
      return (
        <svg {...common}>
          <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'list':
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path
            d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <path
            d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M19.4 15a1.9 1.9 0 00.38 2.1l.05.05a2.3 2.3 0 01-1.63 3.93 2.3 2.3 0 01-1.62-.67l-.06-.05a1.9 1.9 0 00-2.06-.37 1.9 1.9 0 00-1.15 1.73V23a2.3 2.3 0 01-4.6 0v-.08A1.9 1.9 0 007.55 21a1.9 1.9 0 00-2.06.37l-.06.05a2.3 2.3 0 01-3.25 0 2.3 2.3 0 010-3.25l.05-.05A1.9 1.9 0 002.6 15a1.9 1.9 0 00-1.73-1.15H.8a2.3 2.3 0 010-4.6h.07A1.9 1.9 0 002.6 7.55a1.9 1.9 0 00-.37-2.06l-.05-.06a2.3 2.3 0 013.25-3.25l.06.05A1.9 1.9 0 007.55 2.6a1.9 1.9 0 001.15-1.73V.8a2.3 2.3 0 014.6 0v.07A1.9 1.9 0 0015 2.6a1.9 1.9 0 002.06-.37l.06-.05a2.3 2.3 0 013.25 3.25l-.05.06A1.9 1.9 0 0019.4 9c.74.22 1.28.86 1.28 1.67s-.54 1.45-1.28 1.67Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'logout':
      return (
        <svg {...common}>
          <path d="M10 7V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2h-7a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 12h12M7 8l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'download':
      return (
        <svg {...common}>
          <path d="M12 3v10m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17v3h16v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common}>
          <path
            d="M12 18a6 6 0 100-12 6 6 0 000 12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common}>
          <path
            d="M21 13.2A7.5 7.5 0 1110.8 3a6 6 0 0010.2 10.2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return <span className="sc-icon-fallback" />;
  }
}

export function Button({ variant = 'primary', size = 'md', leftIcon, rightIcon, className, to, ...props }) {
  const classes = cx('sc-btn', `sc-btn--${variant}`, `sc-btn--${size}`, className);
  const onClick = (e) => {
    if (props.onClick) props.onClick(e);
    if (to && !e.defaultPrevented) navigate(to);
  };

  return (
    <button {...props} className={classes} onClick={onClick}>
      {leftIcon ? <span className="sc-btn__icon">{leftIcon}</span> : null}
      <span className="sc-btn__label">{props.children}</span>
      {rightIcon ? <span className="sc-btn__icon">{rightIcon}</span> : null}
    </button>
  );
}

export function Badge({ tone = 'neutral', children, className }) {
  return <span className={cx('sc-badge', `sc-badge--${tone}`, className)}>{children}</span>;
}

export function Card({ title, action, children, className }) {
  return (
    <section className={cx('sc-card', className)}>
      {title ? (
        <header className="sc-card__header">
          <h3 className="sc-card__title">{title}</h3>
          {action ? <div className="sc-card__action">{action}</div> : null}
        </header>
      ) : null}
      <div className="sc-card__body">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint, rightIcon, tone = 'neutral' }) {
  return (
    <div className={cx('sc-stat', `sc-stat--${tone}`)}>
      <div className="sc-stat__meta">
        <div className="sc-stat__label">{label}</div>
        <div className="sc-stat__value">{value}</div>
        {hint ? <div className="sc-stat__hint">{hint}</div> : null}
      </div>
      {rightIcon ? <div className="sc-stat__icon">{rightIcon}</div> : null}
    </div>
  );
}

export function Segmented({ value, onChange, options }) {
  return (
    <div className="sc-seg">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={cx('sc-seg__btn', value === o.value && 'is-active')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}


