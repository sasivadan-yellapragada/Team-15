import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../ui';
import '../styles/Tutorials.css';

/**
 * Tutorials Component - Smart Campus Management System
 * Displays Exercises 4, 5, and 6 with interactive demonstrations
 */

// Exercise 4: MongoDB Student Collection Data
const EXERCISE_4_DATA = {
  title: 'Exercise 4: MongoDB Student Collection',
  description: 'Design and implement a MongoDB collection with 5 unique student records',
  topics: ['Database Design', 'Schema Validation', 'Sample Data', 'MongoDB'],
  students: [
    {
      id: 1,
      name: 'Arjun Singh',
      age: 20,
      department: 'CSE',
      courses: [
        { courseName: 'Java Programming', grade: 'A', credits: 4 },
        { courseName: 'Python Basics', grade: 'A', credits: 3 },
        { courseName: 'Web Development', grade: 'A', credits: 4 },
        { courseName: 'Database Systems', grade: 'A', credits: 3 }
      ],
      gpa: 4.0,
      attendance: 95
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 21,
      department: 'ECE',
      courses: [
        { courseName: 'Circuits Theory', grade: 'A', credits: 4 },
        { courseName: 'Signal Processing', grade: 'B', credits: 3 },
        { courseName: 'Electromagnetics', grade: 'B', credits: 4 },
        { courseName: 'Control Systems', grade: 'A', credits: 3 }
      ],
      gpa: 3.75,
      attendance: 90
    },
    {
      id: 3,
      name: 'Rohan Patel',
      age: 20,
      department: 'MECH',
      courses: [
        { courseName: 'Thermodynamics', grade: 'B', credits: 4 },
        { courseName: 'Mechanics', grade: 'B', credits: 3 },
        { courseName: 'CAD Design', grade: 'A', credits: 4 },
        { courseName: 'Machine Design', grade: 'C', credits: 3 }
      ],
      gpa: 3.0,
      attendance: 85
    },
    {
      id: 4,
      name: 'Neha Gupta',
      age: 22,
      department: 'IT',
      courses: [
        { courseName: 'Data Structures', grade: 'B', credits: 4 },
        { courseName: 'Networks', grade: 'B', credits: 3 },
        { courseName: 'Security', grade: 'C', credits: 4 },
        { courseName: 'Physics', grade: 'F', credits: 3 }
      ],
      gpa: 2.5,
      attendance: 70
    },
    {
      id: 5,
      name: 'Vikram Kumar',
      age: 23,
      department: 'CIVIL',
      courses: [
        { courseName: 'Structural Design', grade: 'C', credits: 4 },
        { courseName: 'Building Materials', grade: 'D', credits: 3 },
        { courseName: 'Calculus', grade: 'F', credits: 4 },
        { courseName: 'Chemistry', grade: 'F', credits: 3 }
      ],
      gpa: 2.0,
      attendance: 48
    }
  ]
};

// Exercise 5: CRUD Operations
const EXERCISE_5_DATA = {
  title: 'Exercise 5: CRUD Operations',
  description: 'Perform UPDATE, READ, and DELETE operations on student records',
  topics: ['CRUD', 'MongoDB Queries', 'Data Manipulation', 'Verification'],
  operations: [
    {
      type: 'UPDATE',
      title: 'Attendance Improvement (5% increase)',
      condition: 'Students with attendance < 85%',
      count: 3,
      students: ['Arjun Singh', 'Priya Sharma', 'Rohan Patel'],
      before: [
        { name: 'Arjun Singh', attendance: 95 },
        { name: 'Priya Sharma', attendance: 90 },
        { name: 'Rohan Patel', attendance: 85 }
      ],
      after: [
        { name: 'Arjun Singh', attendance: 100 },
        { name: 'Priya Sharma', attendance: 95 },
        { name: 'Rohan Patel', attendance: 90 }
      ]
    },
    {
      type: 'READ',
      title: 'Low Performance Students',
      condition: 'Failed courses AND attendance < 75%',
      count: 2,
      students: ['Neha Gupta', 'Vikram Kumar'],
      details: [
        { name: 'Neha Gupta', failedCourses: 1, attendance: 70, status: 'Risk' },
        { name: 'Vikram Kumar', failedCourses: 2, attendance: 48, status: 'Critical' }
      ]
    },
    {
      type: 'DELETE',
      title: 'Academic Standing Removal',
      condition: '2+ failed courses AND attendance < 50%',
      count: 1,
      removed: ['Vikram Kumar'],
      reason: 'Does not meet minimum academic standing requirements',
      beforeCount: 5,
      afterCount: 4
    }
  ]
};

// Exercise 6: NPM Utilities
const EXERCISE_6_DATA = {
  title: 'Exercise 6: Custom NPM Project',
  description: 'Build utility functions for campus operations using Node.js',
  topics: ['NPM', 'Custom Modules', 'JavaScript', 'Error Handling'],
  functions: [
    {
      name: 'calculateCGPA',
      type: 'Math Operation',
      description: 'Calculate CGPA from grades and credits',
      example: {
        input: [
          { courseName: 'Data Structures', grade: 'A', credits: 4 },
          { courseName: 'Web Development', grade: 'B', credits: 3 }
        ],
        output: 'CGPA: 3.71'
      }
    },
    {
      name: 'calculateAcademicMetrics',
      type: 'Math Operation',
      description: 'Calculate total credits and course statistics',
      example: {
        input: 4,
        output: { totalCredits: 14, failedCourses: 0, excellentCourses: 2 }
      }
    },
    {
      name: 'generateAcademicCalendar',
      type: 'Date/Time Operation',
      description: 'Generate semester dates and countdown',
      example: {
        input: 'Semester 1',
        output: { startDate: '01-08-2026', endDate: '30-11-2026', daysRemaining: 256 }
      }
    },
    {
      name: 'getEnrollmentDuration',
      type: 'Date/Time Operation',
      description: 'Calculate enrollment tenure',
      example: {
        input: '15-06-2021',
        output: '4 years, 9 months (1737 days)'
      }
    },
    {
      name: 'logStudentInfo',
      type: 'Output Styling',
      description: 'Display colorful student information report',
      example: {
        input: 'Student Object',
        output: 'Formatted report with colors and emojis'
      }
    },
    {
      name: 'validateStudent',
      type: 'Error Handling',
      description: 'Comprehensive student data validation',
      example: {
        input: 'Student Data',
        output: 'Valid: true/false, with error list'
      }
    }
  ],
  dependencies: [
    { name: 'chalk', version: '4.1.2', purpose: 'Terminal styling' },
    { name: 'moment', version: '2.29.4', purpose: 'Date/time operations' },
    { name: 'axios', version: '1.6.2', purpose: 'HTTP requests' },
    { name: 'nodemon', version: '3.0.1', purpose: 'Dev auto-reload' }
  ]
};

/**
 * StudentCollectionViewer - Display Exercise 4 data
 */
function StudentCollectionViewer() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="tutorial-exercise">
      <div className="tutorial-header">
        <h2>{EXERCISE_4_DATA.title}</h2>
        <p className="tutorial-description">{EXERCISE_4_DATA.description}</p>
        <div className="tutorial-topics">
          {EXERCISE_4_DATA.topics.map((topic) => (
            <Badge key={topic} tone="info">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <div className="tutorial-content">
        <div className="students-grid">
          {EXERCISE_4_DATA.students.map((student) => (
            <div
              key={student.id}
              className={`student-card ${selectedStudent?.id === student.id ? 'active' : ''}`}
              onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
            >
              <div className="student-header">
                <div className="student-name">{student.name}</div>
                <Badge tone={student.gpa >= 3.5 ? 'success' : student.gpa >= 3.0 ? 'warning' : 'error'}>
                  GPA: {student.gpa}
                </Badge>
              </div>
              <div className="student-meta">
                <div className="meta-item">
                  <span className="label">Dept:</span>
                  <span className="value">{student.department}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Attend:</span>
                  <span className="value">{student.attendance}%</span>
                </div>
              </div>
              {selectedStudent?.id === student.id && (
                <div className="student-details">
                  <div className="courses-list">
                    <h4>Courses:</h4>
                    {student.courses.map((course, idx) => (
                      <div key={idx} className="course-item">
                        <span className="course-name">{course.courseName}</span>
                        <span className={`grade grade-${course.grade}`}>{course.grade}</span>
                        <span className="credits">{course.credits}cr</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="exercise-stats">
          <h3>Database Statistics</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{EXERCISE_4_DATA.students.length}</div>
              <div className="stat-label">Total Students</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">20</div>
              <div className="stat-label">Total Courses</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">78</div>
              <div className="stat-label">Credit Hours</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">3.3</div>
              <div className="stat-label">Avg GPA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CRUDOperationsViewer - Display Exercise 5 operations
 */
function CRUDOperationsViewer() {
  const [activeOp, setActiveOp] = useState(0);
  const operation = EXERCISE_5_DATA.operations[activeOp];

  return (
    <div className="tutorial-exercise">
      <div className="tutorial-header">
        <h2>{EXERCISE_5_DATA.title}</h2>
        <p className="tutorial-description">{EXERCISE_5_DATA.description}</p>
        <div className="tutorial-topics">
          {EXERCISE_5_DATA.topics.map((topic) => (
            <Badge key={topic} tone="info">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <div className="tutorial-content">
        <div className="operation-tabs">
          {EXERCISE_5_DATA.operations.map((op, idx) => (
            <button
              key={idx}
              className={`tab ${activeOp === idx ? 'active' : ''}`}
              onClick={() => setActiveOp(idx)}
            >
              <Badge tone={op.type === 'UPDATE' ? 'warning' : op.type === 'READ' ? 'info' : 'error'}>
                {op.type}
              </Badge>
              <span>{op.count}</span>
            </button>
          ))}
        </div>

        <div className="operation-details">
          <h3>{operation.title}</h3>
          <div className="condition-box">
            <strong>Condition:</strong> {operation.condition}
          </div>

          {operation.type === 'UPDATE' && (
            <div className="before-after">
              <div className="before">
                <h4>Before:</h4>
                {operation.before.map((item, idx) => (
                  <div key={idx} className="data-row">
                    <span>{item.name}</span>
                    <span className="value">{item.attendance}%</span>
                  </div>
                ))}
              </div>
              <div className="arrow">→</div>
              <div className="after">
                <h4>After (+5%):</h4>
                {operation.after.map((item, idx) => (
                  <div key={idx} className="data-row">
                    <span>{item.name}</span>
                    <span className="value success">{item.attendance}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {operation.type === 'READ' && (
            <div className="read-results">
              <h4>Found {operation.count} student(s):</h4>
              {operation.details.map((item, idx) => (
                <div key={idx} className="result-card">
                  <div className="result-name">{item.name}</div>
                  <div className="result-meta">
                    <span>Failed: {item.failedCourses}</span>
                    <span>Attend: {item.attendance}%</span>
                    <Badge tone={item.status === 'Critical' ? 'error' : 'warning'}>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {operation.type === 'DELETE' && (
            <div className="delete-results">
              <div className="delete-info">
                <p>
                  <strong>Removed:</strong> {operation.removed.join(', ')}
                </p>
                <p>
                  <strong>Reason:</strong> {operation.reason}
                </p>
              </div>
              <div className="delete-stats">
                <div className="stat">
                  <div className="label">Before:</div>
                  <div className="value">{operation.beforeCount} students</div>
                </div>
                <div className="arrow">→</div>
                <div className="stat">
                  <div className="label">After:</div>
                  <div className="value">{operation.afterCount} students</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * NPMUtilitiesViewer - Display Exercise 6 utilities
 */
function NPMUtilitiesViewer() {
  const [selectedFunc, setSelectedFunc] = useState(0);
  const fn = EXERCISE_6_DATA.functions[selectedFunc];

  return (
    <div className="tutorial-exercise">
      <div className="tutorial-header">
        <h2>{EXERCISE_6_DATA.title}</h2>
        <p className="tutorial-description">{EXERCISE_6_DATA.description}</p>
        <div className="tutorial-topics">
          {EXERCISE_6_DATA.topics.map((topic) => (
            <Badge key={topic} tone="info">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      <div className="tutorial-content">
        <div className="functions-list">
          <h3>Utility Functions (8 Total)</h3>
          <div className="func-grid">
            {EXERCISE_6_DATA.functions.map((func, idx) => (
              <div
                key={idx}
                className={`func-card ${selectedFunc === idx ? 'active' : ''}`}
                onClick={() => setSelectedFunc(idx)}
              >
                <div className="func-name">{func.name}</div>
                <Badge tone={func.type.includes('Math') ? 'success' : func.type.includes('Date') ? 'info' : 'warning'}>
                  {func.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="function-details">
          <h3>{fn.name}</h3>
          <p className="func-description">{fn.description}</p>

          <div className="func-example">
            <h4>Example:</h4>
            <div className="example-io">
              <div className="example-section">
                <strong>Input:</strong>
                <div className="code">
                  {typeof fn.example.input === 'string'
                    ? fn.example.input
                    : JSON.stringify(fn.example.input, null, 2)}
                </div>
              </div>
              <div className="example-section">
                <strong>Output:</strong>
                <div className="code">
                  {typeof fn.example.output === 'string'
                    ? fn.example.output
                    : JSON.stringify(fn.example.output, null, 2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dependencies-section">
          <h3>NPM Dependencies (58 Packages)</h3>
          <div className="deps-grid">
            {EXERCISE_6_DATA.dependencies.map((dep, idx) => (
              <div key={idx} className="dep-card">
                <div className="dep-name">{dep.name}</div>
                <div className="dep-version">{dep.version}</div>
                <div className="dep-purpose">{dep.purpose}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Tutorials Component
 */
export default function Tutorials() {
  const [activeExercise, setActiveExercise] = useState(4);

  const [ex8Items, setEx8Items] = useState([]);
  const [ex8Name, setEx8Name] = useState('');
  const [ex8Error, setEx8Error] = useState(null);
  const [ex8Loading, setEx8Loading] = useState(false);

  const loadEx8 = async () => {
    setEx8Loading(true);
    setEx8Error(null);
    try {
      const r = await fetch('/tutorial/ex8/items');
      const j = await r.json();
      setEx8Items(Array.isArray(j.data) ? j.data : []);
    } catch (e) {
      setEx8Error(e.message || 'Failed to load Exercise 8 items');
    } finally {
      setEx8Loading(false);
    }
  };

  const addEx8 = async (e) => {
    e.preventDefault();
    setEx8Error(null);
    try {
      const response = await fetch('/tutorial/ex8/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: ex8Name || 'Demo item' }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEx8Name('');
      await loadEx8();
    } catch (e) {
      setEx8Error(e.message || 'Failed to add Exercise 8 item');
    }
  };

  useEffect(() => {
    if (activeExercise === 8) loadEx8();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExercise]);

  return (
    <div className="tutorials-container">
      <div className="tutorials-header">
        <h1>📚 Smart Campus Management System - Tutorials</h1>
        <p>Complete hands-on exercises with interactive demonstrations</p>
      </div>

      <div className="exercise-nav">
        {[4, 5, 6, 7, 8].map((ex) => (
          <button
            key={ex}
            className={`exercise-btn ${activeExercise === ex ? 'active' : ''}`}
            onClick={() => setActiveExercise(ex)}
          >
            Exercise {ex}
          </button>
        ))}
      </div>

      <div className="exercise-content">
        {activeExercise === 4 && <StudentCollectionViewer />}
        {activeExercise === 5 && <CRUDOperationsViewer />}
        {activeExercise === 6 && <NPMUtilitiesViewer />}
        {activeExercise === 7 && (
          <Card className="exercise-card">
            <h2>Exercise 7: Node.js Web Development (No Express)</h2>
            <p>
              This is implemented as a <strong>pure Node</strong> server using built-in modules: <code>http</code>,{' '}
              <code>fs</code>, <code>path</code>, <code>url</code>.
            </p>
            <div className="footer-links">
              <Button variant="primary" size="sm" onClick={() => window.open('http://localhost:4000', '_blank')}>
                Open Exercise 7 Demo (Port 4000)
              </Button>
              <Button variant="secondary" size="sm" onClick={() => window.open('http://localhost:4000/api/notes', '_blank')}>
                View API: /api/notes
              </Button>
            </div>
            <div style={{ marginTop: 12 }} className="sc-muted sc-sm">
              Code: <code>smart-campus-portal/nodejs-builtin-apis/server.js</code>
            </div>
          </Card>
        )}
        {activeExercise === 8 && (
          <Card className="exercise-card">
            <h2>Exercise 8: Express.js Web Development (Express + fs + path)</h2>
            <p>
              Express routes persist items to a JSON file using Node built-ins (<code>fs</code>, <code>path</code>).
            </p>
            <div className="sc-muted sc-sm">
              API: <code>GET /tutorial/ex8/items</code> and <code>POST /tutorial/ex8/items</code> (served by the main backend on
              port 5001)
            </div>
            {ex8Error ? <div className="sc-textDanger sc-sm" style={{ marginTop: 10 }}>{ex8Error}</div> : null}
            <form className="sc-row" style={{ marginTop: 12 }} onSubmit={addEx8}>
              <input className="sc-input" value={ex8Name} onChange={(ev) => setEx8Name(ev.target.value)} placeholder="Item name" />
              <Button variant="primary" size="sm" type="submit" disabled={ex8Loading}>
                Add (POST)
              </Button>
              <Button variant="secondary" size="sm" type="button" onClick={loadEx8} disabled={ex8Loading}>
                Refresh (GET)
              </Button>
            </form>
            <ul className="sc-muted sc-sm" style={{ marginTop: 12 }}>
              {ex8Items.map((it) => (
                <li key={it.id}>
                  #{it.id} — {it.name} <span className="sc-muted">({it.createdAt})</span>
                </li>
              ))}
              {!ex8Items.length ? <li>No items yet.</li> : null}
            </ul>
            <div style={{ marginTop: 12 }} className="sc-muted sc-sm">
              Code: <code>smart-campus-portal/backend/server.js</code> and file <code>backend/data/tutorial-ex8-items.json</code>
            </div>
          </Card>
        )}
      </div>

      <div className="tutorials-footer">
        <Card className="footer-info">
          <h3>📖 Documentation</h3>
          <p>
            Complete documentation for all exercises is available in the <code>/docs</code> folder with 5,500+ lines of
            detailed explanations, code examples, and step-by-step instructions.
          </p>
          <div className="footer-links">
            <Button variant="secondary" size="sm">
              View Documentation
            </Button>
            <Button variant="primary" size="sm">
              Download Exercises
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
