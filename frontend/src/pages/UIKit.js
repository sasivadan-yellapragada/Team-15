import React from 'react';
import { Badge, Button, Card } from '../ui';

export default function UIKit() {
  return (
    <div className="sc-stack sc-stack--xl">
      <div className="sc-uiKitHeader">
        <div>
          <div className="sc-kicker">v1.0 &nbsp; Design System</div>
          <h1 className="sc-h1">Smart Campus UI Kit</h1>
          <p className="sc-subtitle">
            The official design language for the University Complaint Management System. A collection of reusable components, atomic styles,
            and interaction patterns designed for clarity and efficiency.
          </p>
        </div>
        <Button variant="secondary">Download Assets</Button>
      </div>

      <Card title="Color Palette">
        <div className="sc-palette">
          <div className="sc-swatch sc-swatch--primary">
            <div className="sc-swatch__name">Academic Blue</div>
            <div className="sc-swatch__sub">Primary</div>
            <div className="sc-swatch__hex">#135BEC</div>
            <div className="sc-swatch__ramp">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="sc-swatch sc-swatch--success">
            <div className="sc-swatch__name">Success Green</div>
            <div className="sc-swatch__sub">Success</div>
            <div className="sc-swatch__hex">#10B981</div>
            <div className="sc-swatch__ramp">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="sc-swatch sc-swatch--warning">
            <div className="sc-swatch__name">Warning Orange</div>
            <div className="sc-swatch__sub">Warning</div>
            <div className="sc-swatch__hex">#F59E0B</div>
            <div className="sc-swatch__ramp">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="sc-swatch sc-swatch--danger">
            <div className="sc-swatch__name">Danger Red</div>
            <div className="sc-swatch__sub">Error</div>
            <div className="sc-swatch__hex">#EF4444</div>
            <div className="sc-swatch__ramp">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </Card>

      <div className="sc-2col">
        <Card title="Buttons & Badges">
          <div className="sc-stack">
            <div className="sc-row">
              <Button variant="primary">New Complaint +</Button>
              <Button variant="chip">Filter ▾</Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="sc-row">
              <Badge tone="neutral">New</Badge>
              <Badge tone="warning">In Progress</Badge>
              <Badge tone="success">Resolved</Badge>
              <Badge tone="danger">Urgent</Badge>
              <Badge tone="neutral">Closed</Badge>
            </div>
          </div>
        </Card>

        <Card title="Form Inputs">
          <div className="sc-stack">
            <label className="sc-field">
              <div className="sc-label">Student ID</div>
              <input className="sc-input" placeholder="e.g. 2023-CS-001" />
            </label>
            <label className="sc-field">
              <div className="sc-label">Complaint Category</div>
              <input className="sc-input" value="Facility Maintenance" readOnly />
            </label>
            <label className="sc-field">
              <div className="sc-label sc-textDanger">Subject</div>
              <input className="sc-input sc-input--error" value="Broken" readOnly />
              <div className="sc-errorText">Please provide a more descriptive subject.</div>
            </label>
            <label className="sc-check">
              <input type="checkbox" defaultChecked />
              <span>Notify me via Email</span>
            </label>
            <label className="sc-check sc-check--toggle">
              <span>Urgent</span>
              <input type="checkbox" />
              <span className="sc-toggle" />
            </label>
          </div>
        </Card>
      </div>

      <Card title="Component Examples">
        <div className="sc-2col">
          <div className="sc-exampleCard">
            <div className="sc-exampleCard__img" />
            <div className="sc-exampleCard__body">
              <div className="sc-strong">Projector Malfunction</div>
              <div className="sc-muted sc-sm">Science Block, Room 304</div>
              <p className="sc-paragraph sc-sm">The projector in the main lecture hall keeps flickering and turning off randomly during presentations.</p>
              <div className="sc-row sc-row--between">
                <Badge tone="warning">In Progress</Badge>
                <div className="sc-pillAvatar">JD</div>
              </div>
            </div>
          </div>

          <Card title="Recent Complaints" action={<a className="sc-link" href="#/" onClick={(e) => e.preventDefault()}>View All</a>}>
            <div className="sc-list">
              <div className="sc-listItem">
                <div>
                  <div className="sc-strong">Unstable WiFi Signal</div>
                </div>
                <div className="sc-miniBadge">📶</div>
              </div>
              <div className="sc-listItem">
                <div className="sc-strong">Water Leakage</div>
                <div className="sc-miniBadge sc-miniBadge--danger">⌂</div>
              </div>
              <div className="sc-listItem">
                <div className="sc-strong">Broken Chair Replaced</div>
                <div className="sc-miniBadge sc-miniBadge--success">✓</div>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}


