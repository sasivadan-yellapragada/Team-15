import React, { useState, useEffect } from 'react';
import '../styles/Operations.css';

const Operations = () => {
  const [students, setStudents] = useState([]);
  const [operation, setOperation] = useState('read'); // read, update, delete
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    lowAttendance: false,
    failedCourses: false,
    department: 'All'
  });

  // Load students from MongoDB via API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/students');
      const data = await response.json();
      if (data.status === 'success') {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('❌ Failed to load students from database');
    }
  };

  const departments = ['CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];

  const countFailedCourses = (courses) => {
    return courses.filter(c => c.grade === 'F').length;
  };

  const handleRead = async () => {
    try {
      // Always operate on latest data
      await fetchStudents();

      const filtered = (students || []).filter((s) => {
        if (filters.department !== 'All' && s.department !== filters.department) return false;
        if (filters.lowAttendance && !(Number(s.attendance) < 75)) return false;
        if (filters.failedCourses && !(countFailedCourses(s.courses || []) > 0)) return false;
        return true;
      });

      setResults(filtered);
      setMessage(`✅ Found ${filtered.length} student(s) matching your filters`);
    } catch (error) {
      console.error('Error reading students:', error);
      setMessage('❌ Error communicating with server');
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedStudent?._id) {
        setMessage('❌ Please select a student first');
        return;
      }

      const nextAttendance = Number(updateData.attendance);
      if (!Number.isFinite(nextAttendance) || nextAttendance < 0 || nextAttendance > 100) {
        setMessage('❌ Attendance must be a number between 0 and 100');
        return;
      }

      const payload = {
        name: selectedStudent.name,
        age: selectedStudent.age,
        department: selectedStudent.department,
        courses: selectedStudent.courses,
        attendance: nextAttendance,
      };

      const response = await fetch(`http://localhost:5001/api/students/${selectedStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.status === 'success') {
        setMessage('✅ Student attendance updated');
        setSelectedStudent(data.data);
        setUpdateData({ attendance: data.data?.attendance ?? '' });
        fetchStudents();
      } else {
        setMessage(data.message || '❌ Failed to update student');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setMessage('❌ Error communicating with server');
    }
  };

  const handleDelete = async (student) => {
    try {
      if (!student?._id) return;
      const response = await fetch(`http://localhost:5001/api/students/${student._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage(`✅ Deleted ${student.name}`);
        fetchStudents();
      } else {
        setMessage(data.message || '❌ Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting students:', error);
      setMessage('❌ Error communicating with server');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': '#10b981', 'B': '#3b82f6', 'C': '#f59e0b',
      'D': '#ef4444', 'F': '#dc2626'
    };
    return colors[grade] || '#6b7280';
  };

  return (
    <div className="operations">
      <div className="ops-header">
        <h1>🔄 Data Operations</h1>
        <p>Query, Update, and Delete student records with advanced filtering</p>
      </div>

      {message && <div className="ops-message">{message}</div>}

      <div className="ops-tabs">
        <button 
          className={`ops-tab ${operation === 'read' ? 'active' : ''}`}
          onClick={() => { setOperation('read'); setResults([]); setSelectedStudent(null); }}
        >
          📖 Query Data
        </button>
        <button 
          className={`ops-tab ${operation === 'update' ? 'active' : ''}`}
          onClick={() => { setOperation('update'); setResults([]); }}
        >
          ✏️ Update Records
        </button>
        <button 
          className={`ops-tab ${operation === 'delete' ? 'active' : ''}`}
          onClick={() => { setOperation('delete'); setResults([]); setSelectedStudent(null); }}
        >
          🗑️ Delete Records
        </button>
      </div>

      {/* READ OPERATION */}
      {operation === 'read' && (
        <div className="ops-panel">
          <h2>Query Student Data</h2>
          
          <div className="ops-filters">
            <label className="ops-filter-item">
              <input
                type="checkbox"
                checked={filters.lowAttendance}
                onChange={(e) => setFilters({...filters, lowAttendance: e.target.checked})}
              />
              <span>Low Attendance (&lt;75%)</span>
            </label>

            <label className="ops-filter-item">
              <input
                type="checkbox"
                checked={filters.failedCourses}
                onChange={(e) => setFilters({...filters, failedCourses: e.target.checked})}
              />
              <span>Has Failed Courses</span>
            </label>

            <select 
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="ops-select"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => <option key={dept}>{dept}</option>)}
            </select>

            <button onClick={handleRead} className="ops-btn-execute">
              🔍 Execute Query
            </button>
          </div>

          {results.length > 0 && (
            <div className="ops-results">
              <h3>Query Results ({results.length})</h3>
              <div className="ops-cards">
                {results.map(student => (
                  <div key={student.id} className="ops-card">
                    <h4>{student.name}</h4>
                    <div className="ops-card-info">
                      <div><strong>Department:</strong> {student.department}</div>
                      <div><strong>Attendance:</strong> <span className={student.attendance < 75 ? 'text-red' : 'text-green'}>{student.attendance}%</span></div>
                      <div><strong>Age:</strong> {student.age}</div>
                      <div><strong>Failed Courses:</strong> {countFailedCourses(student.courses)}</div>
                    </div>
                    <div className="ops-courses">
                      {student.courses.map((c, i) => (
                        <span key={i} className="ops-course-badge" style={{borderColor: getGradeColor(c.grade)}}>
                          {c.grade === 'F' ? '❌' : '✓'} {c.courseName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* UPDATE OPERATION */}
      {operation === 'update' && (
        <div className="ops-panel">
          <h2>Update Student Records</h2>
          
          <div className="ops-update-form">
            <div className="ops-form-section">
              <label>Select Student to Update:</label>
              <select 
                value={selectedStudent?._id || ''}
                onChange={(e) => {
                  const student = students.find(s => String(s._id) === String(e.target.value));
                  setSelectedStudent(student);
                  setUpdateData({ attendance: student?.attendance || '' });
                }}
                className="ops-select-large"
              >
                <option value="">-- Select Student --</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.department})</option>)}
              </select>
            </div>

            {selectedStudent && (
              <>
                <div className="ops-current-data">
                  <h4>Current Data</h4>
                  <div className="ops-info">
                    <div><strong>Name:</strong> {selectedStudent.name}</div>
                    <div><strong>Department:</strong> {selectedStudent.department}</div>
                    <div><strong>Current Attendance:</strong> {selectedStudent.attendance}%</div>
                    <div><strong>Age:</strong> {selectedStudent.age}</div>
                  </div>
                </div>

                <div className="ops-form-section">
                  <label>New Attendance (%):</label>
                  <div className="ops-input-group">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={updateData.attendance || ''}
                      onChange={(e) => setUpdateData({...updateData, attendance: parseInt(e.target.value)})}
                      placeholder="Enter new attendance percentage"
                      className="ops-input"
                    />
                    <span className="ops-change-indicator">
                      {updateData.attendance && selectedStudent.attendance 
                        ? updateData.attendance > selectedStudent.attendance 
                          ? `+${updateData.attendance - selectedStudent.attendance}%` 
                          : `${updateData.attendance - selectedStudent.attendance}%`
                        : ''}
                    </span>
                  </div>
                </div>

                <button onClick={handleUpdate} className="ops-btn-execute">
                  ✓ Apply Update
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* DELETE OPERATION */}
      {operation === 'delete' && (
        <div className="ops-panel">
          <h2>Delete Student Records</h2>
          <p className="ops-warning">⚠️ Criteria: 2+ failed courses AND &lt;50% attendance</p>
          
          <div className="ops-delete-list">
            {students.map(student => {
              const failedCount = countFailedCourses(student.courses);
              const canDelete = failedCount >= 2 && student.attendance < 50;

              return (
                <div key={student.id} className={`ops-delete-item ${canDelete ? 'deletable' : 'protected'}`}>
                  <div className="ops-delete-info">
                    <h4>{student.name}</h4>
                    <div className="ops-delete-stats">
                      <span className={`ops-stat ${failedCount >= 2 ? 'alert' : ''}`}>
                        Failed Courses: {failedCount}
                      </span>
                      <span className={`ops-stat ${student.attendance < 50 ? 'alert' : ''}`}>
                        Attendance: {student.attendance}%
                      </span>
                      <span className="ops-stat">Department: {student.department}</span>
                    </div>
                  </div>

                  {canDelete ? (
                    <button 
                      onClick={() => handleDelete(student)}
                      className="ops-btn-delete-confirm"
                    >
                      🗑️ Delete
                    </button>
                  ) : (
                    <div className="ops-status-protected">
                      ✓ Protected
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="ops-summary">
            <h4>Summary</h4>
            <p>📊 Total Students: {students.length}</p>
            <p>⚠️ Eligible for Deletion: {students.filter(s => countFailedCourses(s.courses) >= 2 && s.attendance < 50).length}</p>
            <p>✓ Protected: {students.filter(s => !(countFailedCourses(s.courses) >= 2 && s.attendance < 50)).length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operations;
