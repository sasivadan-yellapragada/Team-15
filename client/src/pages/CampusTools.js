import React, { useState, useEffect } from 'react';
import '../styles/CampusTools.css';

const CampusTools = () => {
  const [activeTool, setActiveTool] = useState('cgpa');
  const [cgpaInput, setCgpaInput] = useState([]);
  const [cgpaResult, setCgpaResult] = useState(null);
  const [academicCalendar, setAcademicCalendar] = useState(null);
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [enrollmentResult, setEnrollmentResult] = useState(null);
  const [students, setStudents] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', grade: 'A', credits: 3 });
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [message, setMessage] = useState('');

  // Load students from MongoDB via API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/students');
      const data = await response.json();
      if (data.status === 'success') {
        // Transform MongoDB student format to match CampusTools format
        const transformedStudents = data.data.map(s => ({
          name: s.name,
          courses: s.courses.map(c => ({
            name: c.courseName,
            grade: c.grade,
            credits: c.credits
          }))
        }));
        setStudents(transformedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('❌ Failed to load students from database');
    }
  };

  const grades = ['A', 'B', 'C', 'D', 'F'];
  const gradePoints = { 'A': 4.0, 'B': 3.5, 'C': 3.0, 'D': 2.5, 'F': 0.0 };

  // CGPA Calculator
  const calculateCGPA = () => {
    if (cgpaInput.length === 0) {
      setMessage('❌ Please add at least one course');
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    cgpaInput.forEach(course => {
      const points = gradePoints[course.grade] * course.credits;
      totalPoints += points;
      totalCredits += course.credits;
    });

    const cgpa = (totalPoints / totalCredits).toFixed(2);
    setCgpaResult({
      cgpa,
      totalCredits,
      totalPoints,
      courses: cgpaInput
    });
    setMessage('✅ CGPA calculated successfully!');
  };

  const addCourse = () => {
    if (!newCourse.name.trim()) {
      setMessage('❌ Please enter course name');
      return;
    }
    setCgpaInput([...cgpaInput, newCourse]);
    setNewCourse({ name: '', grade: 'A', credits: 3 });
    setMessage(`✅ Course "${newCourse.name}" added`);
  };

  const removeCourse = (index) => {
    setCgpaInput(cgpaInput.filter((_, i) => i !== index));
  };

  // Academic Calendar
  const generateCalendar = (semester) => {
    const currentYear = new Date().getFullYear();
    let startDate, endDate;

    if (semester === 1) {
      startDate = new Date(`${currentYear}-08-01`);
      endDate = new Date(`${currentYear}-11-30`);
    } else {
      startDate = new Date(`${currentYear + 1}-01-01`);
      endDate = new Date(`${currentYear + 1}-04-30`);
    }

    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    setAcademicCalendar({
      semester,
      year: `${currentYear}-${currentYear + 1}`,
      startDate: startDate.toLocaleDateString('en-GB'),
      endDate: endDate.toLocaleDateString('en-GB'),
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0
    });
    setMessage(`✅ Academic calendar generated for Semester ${semester}`);
  };

  // Enrollment Duration
  const calculateEnrollment = () => {
    if (!enrollmentDate) {
      setMessage('❌ Please select an enrollment date');
      return;
    }

    const enrolled = new Date(enrollmentDate);
    const today = new Date();
    const diffMs = today - enrolled;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    setEnrollmentResult({
      enrollmentDate: enrolled.toLocaleDateString('en-GB'),
      daysEnrolled: diffDays,
      duration: `${years} years, ${months} months`,
      status: years >= 4 ? '✓ Senior Student' : years >= 2 ? '✓ Junior Student' : '✓ Freshman/Sophomore'
    });
    setMessage('✅ Enrollment duration calculated');
  };

  // Academic Metrics
  const calculateMetrics = (student) => {
    let totalCredits = 0;
    let failedCount = 0;
    let excellentCount = 0;

    student.courses.forEach(course => {
      totalCredits += course.credits;
      if (course.grade === 'F') failedCount++;
      if (course.grade === 'A') excellentCount++;
    });

    return { totalCredits, failedCount, excellentCount };
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': '#10b981', 'B': '#3b82f6', 'C': '#f59e0b',
      'D': '#ef4444', 'F': '#dc2626'
    };
    return colors[grade];
  };

  return (
    <div className="campus-tools">
      <div className="ct-header">
        <h1>🛠️ Campus Tools & Utilities</h1>
        <p>Calculate CGPA, generate academic calendars, and track enrollment</p>
      </div>

      {message && <div className="ct-message">{message}</div>}

      <div className="ct-tabs">
        <button 
          className={`ct-tab ${activeTool === 'cgpa' ? 'active' : ''}`}
          onClick={() => { setActiveTool('cgpa'); setMessage(''); }}
        >
          📊 CGPA Calculator
        </button>
        <button 
          className={`ct-tab ${activeTool === 'calendar' ? 'active' : ''}`}
          onClick={() => { setActiveTool('calendar'); setMessage(''); }}
        >
          📅 Academic Calendar
        </button>
        <button 
          className={`ct-tab ${activeTool === 'enrollment' ? 'active' : ''}`}
          onClick={() => { setActiveTool('enrollment'); setMessage(''); }}
        >
          📈 Enrollment Duration
        </button>
        <button 
          className={`ct-tab ${activeTool === 'metrics' ? 'active' : ''}`}
          onClick={() => { setActiveTool('metrics'); setMessage(''); }}
        >
          📋 Academic Metrics
        </button>
      </div>

      {/* CGPA CALCULATOR */}
      {activeTool === 'cgpa' && (
        <div className="ct-panel">
          <h2>CGPA Calculator</h2>
          <p>Calculate your Cumulative Grade Point Average (A=4.0, B=3.5, C=3.0, D=2.5, F=0.0)</p>

          <div className="ct-input-section">
            <div className="ct-form-group">
              <label>Course Name:</label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                placeholder="e.g., Data Structures"
              />
            </div>

            <div className="ct-form-row">
              <div className="ct-form-group">
                <label>Grade:</label>
                <select
                  value={newCourse.grade}
                  onChange={(e) => setNewCourse({...newCourse, grade: e.target.value})}
                >
                  {grades.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

              <div className="ct-form-group">
                <label>Credits:</label>
                <select
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
                >
                  {[1, 2, 3, 4, 5].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <button onClick={addCourse} className="ct-btn-add">
                + Add Course
              </button>
            </div>
          </div>

          {cgpaInput.length > 0 && (
            <div className="ct-courses-list">
              <h3>Courses Added ({cgpaInput.length})</h3>
              <div className="ct-course-items">
                {cgpaInput.map((course, idx) => (
                  <div key={idx} className="ct-course-item">
                    <div className="ct-course-details">
                      <span className="ct-course-name">{course.name}</span>
                      <div className="ct-course-meta">
                        <span style={{ color: getGradeColor(course.grade) }}>
                          Grade: {course.grade}
                        </span>
                        <span>Credits: {course.credits}</span>
                        <span>Points: {(gradePoints[course.grade] * course.credits).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCourse(idx)}
                      className="ct-btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={calculateCGPA} className="ct-btn-calculate">
                🔢 Calculate CGPA
              </button>
            </div>
          )}

          {cgpaResult && (
            <div className="ct-result">
              <div className="ct-result-main">
                <div className="ct-cgpa-display">
                  <h3>Your CGPA</h3>
                  <div className="ct-cgpa-value">{cgpaResult.cgpa}</div>
                </div>

                <div className="ct-result-details">
                  <div className="ct-detail-item">
                    <span className="ct-label">Total Credits:</span>
                    <span className="ct-value">{cgpaResult.totalCredits}</span>
                  </div>
                  <div className="ct-detail-item">
                    <span className="ct-label">Total Grade Points:</span>
                    <span className="ct-value">{cgpaResult.totalPoints.toFixed(2)}</span>
                  </div>
                  <div className="ct-detail-item">
                    <span className="ct-label">Courses:</span>
                    <span className="ct-value">{cgpaResult.courses.length}</span>
                  </div>
                </div>
              </div>

              <div className="ct-cgpa-interpretation">
                {cgpaResult.cgpa >= 3.5 && <div className="ct-excellent">🌟 Excellent (3.5+)</div>}
                {cgpaResult.cgpa >= 3.0 && cgpaResult.cgpa < 3.5 && <div className="ct-good">✓ Good (3.0-3.5)</div>}
                {cgpaResult.cgpa >= 2.5 && cgpaResult.cgpa < 3.0 && <div className="ct-satisfactory">~ Satisfactory (2.5-3.0)</div>}
                {cgpaResult.cgpa < 2.5 && <div className="ct-warning">⚠️ Needs Improvement (&lt;2.5)</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACADEMIC CALENDAR */}
      {activeTool === 'calendar' && (
        <div className="ct-panel">
          <h2>Academic Calendar Generator</h2>
          <p>View semester dates and remaining days</p>

          <div className="ct-calendar-buttons">
            <button onClick={() => generateCalendar(1)} className="ct-btn-semester">
              📅 Semester 1 (Aug-Nov)
            </button>
            <button onClick={() => generateCalendar(2)} className="ct-btn-semester">
              📅 Semester 2 (Jan-Apr)
            </button>
          </div>

          {academicCalendar && (
            <div className="ct-calendar-result">
              <div className="ct-calendar-header">
                <h3>Academic Year {academicCalendar.year}</h3>
                <h4>Semester {academicCalendar.semester}</h4>
              </div>

              <div className="ct-calendar-details">
                <div className="ct-date-item">
                  <span className="ct-label">📍 Start Date:</span>
                  <span className="ct-value">{academicCalendar.startDate}</span>
                </div>
                <div className="ct-date-item">
                  <span className="ct-label">📍 End Date:</span>
                  <span className="ct-value">{academicCalendar.endDate}</span>
                </div>
                <div className="ct-date-item countdown">
                  <span className="ct-label">⏱️ Days Remaining:</span>
                  <span className="ct-countdown">{academicCalendar.daysRemaining}</span>
                </div>
              </div>

              <div className="ct-semester-info">
                {academicCalendar.semester === 1 
                  ? <p>📌 First semester: Focus on core courses and foundational concepts</p>
                  : <p>📌 Second semester: Advanced topics and practical applications</p>
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* ENROLLMENT DURATION */}
      {activeTool === 'enrollment' && (
        <div className="ct-panel">
          <h2>Enrollment Duration Calculator</h2>
          <p>Calculate how long you've been enrolled at the campus</p>

          <div className="ct-enrollment-form">
            <label>Enrollment Date:</label>
            <input
              type="date"
              value={enrollmentDate}
              onChange={(e) => setEnrollmentDate(e.target.value)}
              className="ct-date-input"
            />
            <button onClick={calculateEnrollment} className="ct-btn-calculate">
              🔢 Calculate Duration
            </button>
          </div>

          {enrollmentResult && (
            <div className="ct-enrollment-result">
              <div className="ct-status-badge">{enrollmentResult.status}</div>

              <div className="ct-enrollment-details">
                <div className="ct-enroll-item">
                  <span className="ct-label">Enrollment Date:</span>
                  <span className="ct-value">{enrollmentResult.enrollmentDate}</span>
                </div>
                <div className="ct-enroll-item">
                  <span className="ct-label">Duration:</span>
                  <span className="ct-value-large">{enrollmentResult.duration}</span>
                </div>
                <div className="ct-enroll-item">
                  <span className="ct-label">Days Enrolled:</span>
                  <span className="ct-value">{enrollmentResult.daysEnrolled}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACADEMIC METRICS */}
      {activeTool === 'metrics' && (
        <div className="ct-panel">
          <h2>Academic Metrics</h2>
          <p>View course statistics and performance metrics</p>

          <div className="ct-metrics-selector">
            <label>Select Student:</label>
            <select 
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(parseInt(e.target.value))}
              className="ct-select"
            >
              {students.map((s, i) => (
                <option key={i} value={i}>{s.name}</option>
              ))}
            </select>
          </div>

          {students[selectedStudent] && (
            <div className="ct-metrics-display">
              <h3>{students[selectedStudent].name}</h3>

              {(() => {
                const metrics = calculateMetrics(students[selectedStudent]);
                return (
                  <div className="ct-metrics-grid">
                    <div className="ct-metric-card">
                      <div className="ct-metric-icon">📚</div>
                      <div className="ct-metric-name">Total Credits</div>
                      <div className="ct-metric-value">{metrics.totalCredits}</div>
                    </div>

                    <div className="ct-metric-card">
                      <div className="ct-metric-icon">✓</div>
                      <div className="ct-metric-name">Excellent Courses</div>
                      <div className="ct-metric-value" style={{color: '#10b981'}}>{metrics.excellentCount}</div>
                    </div>

                    <div className="ct-metric-card">
                      <div className="ct-metric-icon">❌</div>
                      <div className="ct-metric-name">Failed Courses</div>
                      <div className="ct-metric-value" style={{color: metrics.failedCount > 0 ? '#dc2626' : '#10b981'}}>
                        {metrics.failedCount}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="ct-courses-breakdown">
                <h4>Course Breakdown</h4>
                {students[selectedStudent].courses.map((course, idx) => (
                  <div key={idx} className="ct-course-row">
                    <span className="ct-course-name">{course.name}</span>
                    <div className="ct-course-info">
                      <span style={{ color: getGradeColor(course.grade), fontWeight: 'bold' }}>
                        {course.grade}
                      </span>
                      <span className="ct-credits">{course.credits} credits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampusTools;
