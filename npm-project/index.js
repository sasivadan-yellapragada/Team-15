/**
 * index.js
 * Main file demonstrating Smart Campus Management System utilities
 * Uses: CampusModule, chalk, moment, axios
 */

const CampusModule = require('./CampusModule');
const chalk = require('chalk');
const moment = require('moment');
const axios = require('axios');

// Initialize the campus module
const campus = new CampusModule();

// Display module information
campus.showModuleInfo();

console.log(chalk.bold.blue('\n════════════════════════════════════════════════════════════════\n'));
console.log(chalk.bold.yellow('🎓 SMART CAMPUS MANAGEMENT SYSTEM - UTILITIES DEMONSTRATION\n'));
console.log(chalk.bold.blue('════════════════════════════════════════════════════════════════\n'));

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 1: Math Operations - CGPA Calculation
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('\n1️⃣  MATH OPERATIONS: CGPA Calculation\n'));
console.log(chalk.dim('─'.repeat(60)));

const studentCourses1 = [
  { courseName: 'Data Structures', grade: 'A', credits: 4 },
  { courseName: 'Web Development', grade: 'B', credits: 3 },
  { courseName: 'Database Systems', grade: 'A', credits: 4 },
  { courseName: 'Algorithms', grade: 'B', credits: 3 }
];

const cgpaResult = campus.calculateCGPA(studentCourses1);
console.log(chalk.white(`📊 Student: Arjun Singh (CSE)\n`));
console.log(chalk.yellow('Courses:'));
studentCourses1.forEach(course => {
  console.log(chalk.cyan(`   • ${course.courseName} - Grade: ${course.grade}, Credits: ${course.credits}`));
});
console.log(chalk.white(`\n${cgpaResult.message}`));
console.log(chalk.greenBright(`   CGPA Score: ${cgpaResult.cgpa}`));

// Test error handling in CGPA
console.log(chalk.white('\n--- Testing Error Handling ---'));
const invalidResult = campus.calculateCGPA([
  { courseName: 'Test Course', grade: 'X', credits: 3 }
]);
console.log(chalk.red(invalidResult.message));

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 2: Math Operations - Academic Metrics
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('\n\n2️⃣  MATH OPERATIONS: Academic Metrics Calculation\n'));
console.log(chalk.dim('─'.repeat(60)));

const studentCourses2 = [
  { courseName: 'Computer Networks', grade: 'A', credits: 4 },
  { courseName: 'Operating Systems', grade: 'B', credits: 3 },
  { courseName: 'Software Engineering', grade: 'A', credits: 4 },
  { courseName: 'Security', grade: 'C', credits: 3 }
];

const metricsResult = campus.calculateAcademicMetrics(studentCourses2);
console.log(chalk.white(`📊 Student: Priya Sharma (ECE)\n`));
console.log(chalk.yellow('Courses:'));
studentCourses2.forEach(course => {
  console.log(chalk.cyan(`   • ${course.courseName} - Grade: ${course.grade}, Credits: ${course.credits}`));
});
console.log(chalk.white(`\n${metricsResult.message}`));
console.log(chalk.cyanBright(`   Total Credits: ${metricsResult.totalCredits}`));
console.log(chalk.yellowBright(`   Failed Courses: ${metricsResult.failedCourses}`));
console.log(chalk.greenBright(`   Excellent Courses (A): ${metricsResult.excellentCourses}`));

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 3: Date/Time Operations - Academic Calendar
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('\n\n3️⃣  DATE/TIME OPERATIONS: Academic Calendar\n'));
console.log(chalk.dim('─'.repeat(60)));

for (let sem = 1; sem <= 2; sem++) {
  const calendarResult = campus.generateAcademicCalendar(sem);
  console.log(chalk.white(`\n📅 ${calendarResult.message}`));
  console.log(chalk.cyanBright(`   Academic Year: ${calendarResult.academicYear}`));
  console.log(chalk.cyanBright(`   Semester: ${calendarResult.semester}`));
  console.log(chalk.cyanBright(`   Start Date: ${calendarResult.startDate}`));
  console.log(chalk.cyanBright(`   End Date: ${calendarResult.endDate}`));
  console.log(chalk.yellowBright(`   Days Remaining: ${calendarResult.daysRemaining}`));
}

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 4: Date/Time Operations - Enrollment Duration
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('\n\n4️⃣  DATE/TIME OPERATIONS: Student Enrollment Duration\n'));
console.log(chalk.dim('─'.repeat(60)));

const enrollmentDates = [
  { name: 'Rohan Patel', date: '15-06-2021' },
  { name: 'Neha Gupta', date: '18-07-2022' },
  { name: 'Vikram Kumar', date: '20-08-2020' }
];

enrollmentDates.forEach(student => {
  const durationResult = campus.getEnrollmentDuration(student.date);
  console.log(chalk.white(`\n👤 ${student.name}`));
  console.log(chalk.cyanBright(`   Enrollment Date: ${durationResult.enrollmentDate}`));
  console.log(chalk.cyanBright(`   Days Enrolled: ${durationResult.daysEnrolled}`));
  console.log(chalk.greenBright(`   Duration: ${durationResult.durationFormatted}`));
});

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 5: Colorful Logging - Student Information
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('\n\n5️⃣  COLORFUL LOGGING: Student Information Report\n'));
console.log(chalk.dim('─'.repeat(60)));

const studentData = {
  name: 'Arjun Singh',
  age: 20,
  department: 'CSE',
  attendance: 92,
  courses: [
    { courseName: 'Data Structures', grade: 'A', credits: 4 },
    { courseName: 'Web Development', grade: 'B', credits: 3 },
    { courseName: 'Database Systems', grade: 'A', credits: 4 }
  ]
};

campus.logStudentInfo(studentData);

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 6: Error Handling - Student Validation
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('6️⃣  ERROR HANDLING: Student Data Validation\n'));
console.log(chalk.dim('─'.repeat(60)));

// Valid student
console.log(chalk.white('\n✅ Testing VALID student data:\n'));
const validStudent = {
  name: 'Priya Sharma',
  age: 21,
  department: 'ECE',
  attendance: 85,
  courses: [
    { courseName: 'Circuits', grade: 'B', credits: 4 },
    { courseName: 'Signals', grade: 'A', credits: 3 }
  ]
};

const validationResult1 = campus.validateStudent(validStudent);
console.log(validationResult1.message);

// Invalid student - multiple errors
console.log(chalk.white('\n❌ Testing INVALID student data:\n'));
const invalidStudent = {
  name: '',
  age: 50,
  department: 'INVALID',
  attendance: 150,
  courses: [
    { courseName: 'Test', grade: 'X', credits: 0 }
  ]
};

const validationResult2 = campus.validateStudent(invalidStudent);
console.log(validationResult2.message);
console.log(chalk.red('\nValidation Errors:'));
validationResult2.errors.forEach((err, idx) => {
  console.log(chalk.red(`   ${idx + 1}. ${err}`));
});

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 7: Current Date/Time with Moment
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('\n\n7️⃣  CURRENT SYSTEM DATE/TIME\n'));
console.log(chalk.dim('─'.repeat(60)));

const now = moment();
console.log(chalk.yellow(`\n📍 Current Timestamp: ${now.format('dddd, MMMM Do YYYY, h:mm:ss a')}`));
console.log(chalk.cyanBright(`   ISO Format: ${now.format('YYYY-MM-DD HH:mm:ss')}`));
console.log(chalk.cyanBright(`   Unix Timestamp: ${now.unix()}`));
console.log(chalk.cyanBright(`   Time Zone: ${now.format('Z')}`));

// ═══════════════════════════════════════════════════════════════
// DEMONSTRATION 8: Axios - Campus API Check
// ═══════════════════════════════════════════════════════════════

console.log(chalk.bold.magenta('\n\n8️⃣  AXIOS - Testing Campus API Endpoints\n'));
console.log(chalk.dim('─'.repeat(60)));

(async () => {
  try {
    console.log(chalk.white('\n🌐 Testing Campus Portal API...\n'));
    
    const apiUrl = 'http://localhost:5001/api/health';
    console.log(chalk.cyan(`   Endpoint: ${apiUrl}`));
    
    try {
      const response = await axios.get(apiUrl, { timeout: 3000 });
      console.log(chalk.greenBright(`   ✅ Status: ${response.status} - ${response.statusText}`));
      console.log(chalk.greenBright(`   ✅ Response: ${response.data.message}`));
    } catch (apiError) {
      console.log(chalk.yellowBright(`   ⚠️  API not available (ensure backend is running on port 5001)`));
      console.log(chalk.dim(`   Error: ${apiError.code}`));
    }

    // Final Summary
    console.log(chalk.bold.blue('\n═════════════════════════════════════════════════════════════════\n'));
    console.log(chalk.bold.greenBright('✅ ALL DEMONSTRATIONS COMPLETED SUCCESSFULLY!\n'));
    console.log(chalk.cyan('Features Demonstrated:'));
    console.log(chalk.white('   1. ✓ Math Operations (CGPA & Academic Metrics)'));
    console.log(chalk.white('   2. ✓ Date/Time Operations (Calendar & Enrollment Duration)'));
    console.log(chalk.white('   3. ✓ Colorful Console Output (Chalk library)'));
    console.log(chalk.white('   4. ✓ Comprehensive Error Handling & Validation'));
    console.log(chalk.white('   5. ✓ API Integration Testing (Axios)\n'));
    console.log(chalk.bold.blue('═════════════════════════════════════════════════════════════════\n'));

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
})();
