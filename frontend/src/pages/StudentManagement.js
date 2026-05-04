import React, { useState, useEffect } from 'react';
import '../styles/StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    department: '',
    attendance: '',
    courses: []
  });
  const [courseInput, setCourseInput] = useState({
    courseName: '',
    grade: 'A',
    credits: 3
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchDept, setSearchDept] = useState('All');
  const [message, setMessage] = useState('');

  // Load students from MongoDB via API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
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
  const grades = ['A', 'B', 'C', 'D', 'F'];

  const handleAddCourse = () => {
    if (courseInput.courseName.trim()) {
      setFormData({
        ...formData,
        courses: [...formData.courses, courseInput]
      });
      setCourseInput({ courseName: '', grade: 'A', credits: 3 });
    }
  };

  const handleRemoveCourse = (index) => {
    setFormData({
      ...formData,
      courses: formData.courses.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.department || !formData.attendance || formData.courses.length === 0) {
      setMessage('❌ Please fill all fields and add at least one course');
      return;
    }

    try {
      if (editingId) {
        // Update existing student
        const response = await fetch(`/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.status === 'success') {
          setMessage('✅ Student updated successfully!');
          setEditingId(null);
          fetchStudents();
        } else {
          setMessage('❌ Failed to update student');
        }
      } else {
        // Add new student
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.status === 'success') {
          setMessage('✅ Student added successfully!');
          fetchStudents();
        } else {
          setMessage('❌ Failed to add student');
        }
      }

      setFormData({
        name: '',
        age: '',
        department: '',
        attendance: '',
        courses: []
      });
      setShowForm(false);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('❌ Error communicating with server');
    }
  };

  const handleEdit = (student) => {
    const { _id, __v, createdAt, updatedAt, ...rest } = student || {};
    setFormData(rest);
    setEditingId(_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`/api/students/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setMessage('✅ Student deleted successfully!');
          fetchStudents();
        } else {
          setMessage('❌ Failed to delete student');
        }
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting student:', error);
        setMessage('❌ Error communicating with server');
      }
    }
  };

  const calculateCGPA = (courses) => {
    const gradePoints = { 'A': 4.0, 'B': 3.5, 'C': 3.0, 'D': 2.5, 'F': 0.0 };
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      totalPoints += gradePoints[c.grade] * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': '#10b981',
      'B': '#3b82f6',
      'C': '#f59e0b',
      'D': '#ef4444',
      'F': '#dc2626'
    };
    return colors[grade] || '#6b7280';
  };

  const filteredStudents = searchDept === 'All' 
    ? students 
    : students.filter(s => s.department === searchDept);

  return (
    <div className="student-management">
      <div className="sm-header">
        <h1>📚 Student Management System</h1>
        <p>Manage and track student information, courses, and academic performance</p>
      </div>

      {message && <div className="sm-message">{message}</div>}

      <div className="sm-controls">
        <div className="sm-filter">
          <label>Filter by Department:</label>
          <select value={searchDept} onChange={(e) => setSearchDept(e.target.value)}>
            <option>All</option>
            {departments.map(dept => <option key={dept}>{dept}</option>)}
          </select>
          <span className="sm-count">Total: {filteredStudents.length} students</span>
        </div>
        <button 
          className="sm-btn-add"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              age: '',
              department: '',
              attendance: '',
              courses: []
            });
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="sm-form-container">
          <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
          <form onSubmit={handleSubmit} className="sm-form">
            <div className="sm-form-row">
              <div className="sm-form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Student name"
                />
              </div>
              <div className="sm-form-group">
                <label>Age *</label>
                <input
                  type="number"
                  min="15"
                  max="35"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Age"
                />
              </div>
              <div className="sm-form-group">
                <label>Department *</label>
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => <option key={dept}>{dept}</option>)}
                </select>
              </div>
              <div className="sm-form-group">
                <label>Attendance (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                  placeholder="0-100"
                />
              </div>
            </div>

            <div className="sm-courses-section">
              <h3>Courses</h3>
              <div className="sm-course-input">
                <input
                  type="text"
                  placeholder="Course name"
                  value={courseInput.courseName}
                  onChange={(e) => setCourseInput({...courseInput, courseName: e.target.value})}
                />
                <select
                  value={courseInput.grade}
                  onChange={(e) => setCourseInput({...courseInput, grade: e.target.value})}
                >
                  {grades.map(g => <option key={g}>{g}</option>)}
                </select>
                <select
                  value={courseInput.credits}
                  onChange={(e) => setCourseInput({...courseInput, credits: parseInt(e.target.value)})}
                >
                  {[1, 2, 3, 4, 5].map(c => <option key={c}>{c}</option>)}
                </select>
                <button type="button" onClick={handleAddCourse} className="sm-btn-add-course">
                  Add Course
                </button>
              </div>

              {formData.courses.length > 0 && (
                <div className="sm-courses-list">
                  {formData.courses.map((course, idx) => (
                    <div key={idx} className="sm-course-item">
                      <span>{course.courseName}</span>
                      <span style={{ color: getGradeColor(course.grade) }}>Grade: {course.grade}</span>
                      <span>Credits: {course.credits}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(idx)}
                        className="sm-btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sm-form-actions">
              <button type="submit" className="sm-btn-submit">
                {editingId ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="sm-students-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student._id} className="sm-student-card">
              <div className="sm-card-header">
                <h3>{student.name}</h3>
                <div className="sm-card-actions">
                  <button onClick={() => handleEdit(student)} className="sm-btn-edit" title="Edit">✎</button>
                  <button onClick={() => handleDelete(student._id)} className="sm-btn-delete" title="Delete">✕</button>
                </div>
              </div>

              <div className="sm-card-info">
                <div className="sm-info-item">
                  <span className="sm-label">Department:</span>
                  <span className="sm-value">{student.department}</span>
                </div>
                <div className="sm-info-item">
                  <span className="sm-label">Age:</span>
                  <span className="sm-value">{student.age} years</span>
                </div>
                <div className="sm-info-item">
                  <span className="sm-label">Attendance:</span>
                  <span className={`sm-attendance ${student.attendance >= 75 ? 'good' : 'low'}`}>
                    {student.attendance}%
                  </span>
                </div>
                <div className="sm-info-item">
                  <span className="sm-label">CGPA:</span>
                  <span className="sm-cgpa">{calculateCGPA(student.courses)}</span>
                </div>
              </div>

              <div className="sm-card-courses">
                <h4>Courses ({student.courses.length})</h4>
                {student.courses.map((course, idx) => (
                  <div key={idx} className="sm-course-badge">
                    <span>{course.courseName}</span>
                    <span style={{ color: getGradeColor(course.grade), fontWeight: 'bold' }}>
                      {course.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="sm-empty">No students found</div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
