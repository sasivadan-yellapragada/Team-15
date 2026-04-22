# Exercise 6: Custom NPM Project - Smart Campus Management Utilities

## Project Overview

This exercise demonstrates the creation of a custom NPM project with utility functions for the Smart Campus Management System. The project showcases:

- **Dependencies Management** with npm packages
- **Custom Module Development** (CampusModule.js)
- **Colorful Console Output** using chalk library
- **Date/Time Operations** using moment.js
- **API Integration** using axios
- **Error Handling & Validation** mechanisms
- **Development Environment** setup with nodemon

---

## 📁 Project Structure

```
npm-project/
├── package.json                 # Project configuration and dependencies
├── package-lock.json            # Dependency lock file
├── CampusModule.js              # Custom utility module
├── index.js                     # Main entry point
└── node_modules/                # Installed dependencies (53 packages)
```

---

## 📦 Package.json Configuration

```json
{
  "name": "smart-campus-utils",
  "version": "1.0.0",
  "description": "Smart Campus Management System - Utility Functions for Student Operations",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js",
    "dev": "nodemon index.js",
    "test": "node index.js"
  },
  "keywords": [
    "campus",
    "management",
    "students",
    "utilities"
  ],
  "author": "Smart Campus Team",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "dependencies": {
    "chalk": "^4.1.2",
    "moment": "^2.29.4",
    "axios": "^1.6.2"
  }
}
```

### Installed Dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| **chalk** | 4.1.2 | Terminal string styling with colors and background colors |
| **moment** | 2.29.4 | Parse, validate, manipulate, and display dates and times |
| **axios** | 1.6.2 | Promise-based HTTP client for making API requests |
| **nodemon** | 3.0.1 | (Dev) Automatically restarts Node app during development |

**Total Packages Installed:** 58 packages (including dependencies)

---

## 🔧 CampusModule.js - Custom Utility Module

Complete implementation of the Smart Campus utility module with 8 major functions:

### Class: CampusModule

#### 1. **calculateCGPA(courses)**
- **Purpose:** Calculate student Cumulative GPA from courses and grades
- **Formula:** CGPA = Sum of (Grade Points × Credits) / Total Credits
- **Grade Scale:** A=4.0, B=3.5, C=3.0, D=2.5, F=0.0
- **Parameters:** Array of course objects `{courseName, grade, credits}`
- **Returns:** `{success, cgpa, message}`
- **Error Handling:** Validates grades and credit values

**Example:**
```javascript
const courses = [
  { courseName: 'Data Structures', grade: 'A', credits: 4 },
  { courseName: 'Web Development', grade: 'B', credits: 3 }
];
const result = campus.calculateCGPA(courses);
// Result: { success: true, cgpa: '3.71', message: '✅ CGPA calculated successfully: 3.71' }
```

#### 2. **calculateAcademicMetrics(courses)**
- **Purpose:** Calculate total credit hours and course statistics
- **Metrics:** Total credits, failed courses count, excellent courses (A grades) count
- **Parameters:** Array of course objects
- **Returns:** `{success, totalCredits, failedCourses, excellentCourses, message}`

**Example:**
```javascript
const metrics = campus.calculateAcademicMetrics(courses);
// Result: { 
//   success: true, 
//   totalCredits: 14, 
//   failedCourses: 0, 
//   excellentCourses: 2,
//   message: '✅ Metrics calculated: 14 credits, 0 failed, 2 excellent'
// }
```

#### 3. **generateAcademicCalendar(semester)**
- **Purpose:** Generate academic calendar for specific semester
- **Semesters:** 1 (Aug-Nov), 2 (Jan-Apr)
- **Parameters:** Semester number (1 or 2)
- **Returns:** `{academicYear, semester, startDate, endDate, daysRemaining}`
- **Dates Format:** DD-MM-YYYY

**Example:**
```javascript
const calendar = campus.generateAcademicCalendar(1);
// Result: {
//   success: true,
//   academicYear: '2026-2027',
//   semester: 'Semester 1',
//   startDate: '01-08-2026',
//   endDate: '30-11-2026',
//   daysRemaining: 256
// }
```

#### 4. **getEnrollmentDuration(enrollmentDate)**
- **Purpose:** Calculate student enrollment duration from enrollment date
- **Parameters:** Enrollment date string in DD-MM-YYYY format
- **Returns:** `{enrollmentDate, daysEnrolled, durationFormatted}`
- **Duration Format:** "X years, Y months"

**Example:**
```javascript
const duration = campus.getEnrollmentDuration('15-06-2021');
// Result: {
//   success: true,
//   enrollmentDate: '15-06-2021',
//   daysEnrolled: 1737,
//   durationFormatted: '4 years, 9 months'
// }
```

#### 5. **logStudentInfo(student)**
- **Purpose:** Display student information with colorful formatting using chalk
- **Colorful Output:** Cyan header, yellow labels, green values, colored grade indicators
- **Parameters:** Student object `{name, age, department, attendance, courses[]}`
- **Uses:** Chalk for terminal styling

**Example:**
```javascript
const student = {
  name: 'Arjun Singh',
  age: 20,
  department: 'CSE',
  attendance: 92,
  courses: [
    { courseName: 'Data Structures', grade: 'A', credits: 4 }
  ]
};
campus.logStudentInfo(student);
// Output: Formatted student report with colors and emojis
```

#### 6. **getGradeColor(grade)**
- **Purpose:** Return appropriate color function based on grade
- **Color Mapping:**
  - A → Green
  - B → Cyan
  - C → Yellow
  - D → Yellow background with black text
  - F → Red

#### 7. **validateStudent(student)**
- **Purpose:** Comprehensive student data validation with multiple error checks
- **Validates:**
  - Name: Non-empty string required
  - Age: 15-35 range
  - Department: CSE, ECE, MECH, IT, or CIVIL
  - Courses: Minimum 2 courses with valid grades and credits
  - Attendance: 0-100 range
- **Returns:** `{valid, errors[], message}`

**Example:**
```javascript
const validation = campus.validateStudent(invalidStudent);
// Result: {
//   valid: false,
//   errors: [
//     'Name is required and must be a non-empty string',
//     'Age must be an integer between 15 and 35',
//     ...
//   ]
// }
```

#### 8. **showModuleInfo()**
- **Purpose:** Display module metadata and creation timestamp
- **Output:** Name, version, and current date/time with colors

---

## 🚀 index.js - Main Demonstration File

Complete demonstration script with 8 test cases:

### Demonstration 1: CGPA Calculation
- Student: Arjun Singh (CSE)
- Courses: 4 courses with A and B grades
- **Output Result:** CGPA: 3.79

### Demonstration 2: Academic Metrics
- Student: Priya Sharma (ECE)
- Courses: 4 courses with mixed grades
- **Output Results:**
  - Total Credits: 14
  - Failed Courses: 0
  - Excellent Courses: 2

### Demonstration 3: Academic Calendar
- Generates calendar for both semesters
- **Semester 1 (Aug-Nov):**
  - Start: 01-08-2026
  - End: 30-11-2026
  - Days Remaining: 256
- **Semester 2 (Jan-Apr):**
  - Start: 01-01-2027
  - End: 30-04-2027
  - Days Remaining: 407

### Demonstration 4: Enrollment Duration
- Students: Rohan Patel, Neha Gupta, Vikram Kumar
- Enrollment dates tracked over 1737-2036 days (4-5 years)
- **Output Format:** Years and months calculation

### Demonstration 5: Colorful Student Report
- Displays formatted student information with colors
- Uses emojis and box drawing characters
- Organized layout with sections

### Demonstration 6: Error Handling & Validation
- Valid student validation: ✅ PASS
- Invalid student with 5 errors: ❌ FAIL
- Shows all validation errors

### Demonstration 7: Current Date/Time
- Current timestamp with multiple formats
- ISO format, Unix timestamp, timezone
- **Output:** Wednesday, March 18th 2026, 1:59:36 pm

### Demonstration 8: API Integration Testing
- Tests campus portal API health check endpoint
- Uses axios to make HTTP GET request
- Graceful handling if API is unavailable
- **Endpoint:** http://localhost:5001/api/health

---

## ⚙️ Installation & Execution

### Step 1: Navigate to Project Directory
```bash
cd /Users/sasivadan/fsd_team_presentation/smart-campus-portal/npm-project
```

### Step 2: Install Dependencies
```bash
npm install
```

**Output:**
```
added 58 packages, and audited 59 packages in 1s

13 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Execute with Node.js
```bash
node index.js
```

### Step 4: Execute with nodemon (Auto-reload)
```bash
npm start
# or
npm run dev
```

### Step 5: Test Script
```bash
npm test
```

---

## 📊 Execution Output

### Full Console Output:

```
╔═══════════════════════════════════════╗
║      CAMPUS MODULE INFORMATION        ║
╚═══════════════════════════════════════╝

Module: Smart Campus Utilities
Version: 1.0.0
Created: 18-03-2026 13:59:36


════════════════════════════════════════════════════════════════

🎓 SMART CAMPUS MANAGEMENT SYSTEM - UTILITIES DEMONSTRATION

════════════════════════════════════════════════════════════════


1️⃣  MATH OPERATIONS: CGPA Calculation

────────────────────────────────────────────────────────────
📊 Student: Arjun Singh (CSE)

Courses:
   • Data Structures - Grade: A, Credits: 4
   • Web Development - Grade: B, Credits: 3
   • Database Systems - Grade: A, Credits: 4
   • Algorithms - Grade: B, Credits: 3

✅ CGPA calculated successfully: 3.79
   CGPA Score: 3.79

--- Testing Error Handling ---
❌ CGPA Calculation Error: ❌ Invalid grade: X. Must be A, B, C, D, or F


2️⃣  MATH OPERATIONS: Academic Metrics Calculation

────────────────────────────────────────────────────────────
📊 Student: Priya Sharma (ECE)

Courses:
   • Computer Networks - Grade: A, Credits: 4
   • Operating Systems - Grade: B, Credits: 3
   • Software Engineering - Grade: A, Credits: 4
   • Security - Grade: C, Credits: 3

✅ Metrics calculated: 14 credits, 0 failed, 2 excellent
   Total Credits: 14
   Failed Courses: 0
   Excellent Courses (A): 2


3️⃣  DATE/TIME OPERATIONS: Academic Calendar

────────────────────────────────────────────────────────────

📅 ✅ Calendar generated for 2026-2027, Sem 1
   Academic Year: 2026-2027
   Semester: Semester 1
   Start Date: 01-08-2026
   End Date: 30-11-2026
   Days Remaining: 256

📅 ✅ Calendar generated for 2026-2027, Sem 2
   Academic Year: 2026-2027
   Semester: Semester 2
   Start Date: 01-01-2027
   End Date: 30-04-2027
   Days Remaining: 407


4️⃣  DATE/TIME OPERATIONS: Student Enrollment Duration

────────────────────────────────────────────────────────────

👤 Rohan Patel
   Enrollment Date: 15-06-2021
   Days Enrolled: 1737
   Duration: 4 years, 9 months

👤 Neha Gupta
   Enrollment Date: 18-07-2022
   Days Enrolled: 1339
   Duration: 3 years, 8 months

👤 Vikram Kumar
   Enrollment Date: 20-08-2020
   Days Enrolled: 2036
   Duration: 5 years, 6 months


5️⃣  COLORFUL LOGGING: Student Information Report

────────────────────────────────────────────────────────────

╔════════════════════════════════════════╗
║   STUDENT INFORMATION REPORT           ║
╚════════════════════════════════════════╝

📌 Personal Details:
   Name: Arjun Singh
   Age: 20 years
   Department: CSE
   Attendance: 92%

📚 Courses:
   1. Data Structures
      Grade: A | Credits: 4
   2. Web Development
      Grade: B | Credits: 3
   3. Database Systems
      Grade: A | Credits: 4

═════════════════════════════════════════

6️⃣  ERROR HANDLING: Student Data Validation

────────────────────────────────────────────────────────────

✅ Testing VALID student data:

✅ Student data is valid!

❌ Testing INVALID student data:

❌ Validation failed with 5 error(s)

Validation Errors:
   1. Name is required and must be a non-empty string
   2. Age must be an integer between 15 and 35
   3. Department must be one of: CSE, ECE, MECH, IT, CIVIL
   4. Student must have at least 2 courses
   5. Attendance must be a number between 0 and 100


7️⃣  CURRENT SYSTEM DATE/TIME

────────────────────────────────────────────────────────────

📍 Current Timestamp: Wednesday, March 18th 2026, 1:59:36 pm
   ISO Format: 2026-03-18 13:59:36
   Unix Timestamp: 1773822576
   Time Zone: +05:30


8️⃣  AXIOS - Testing Campus API Endpoints

────────────────────────────────────────────────────────────

🌐 Testing Campus Portal API...

   Endpoint: http://localhost:5001/api/health
   ✅ Status: 200 - OK
   ✅ Response: Smart Campus Portal API is running!

═════════════════════════════════════════════════════════════════

✅ ALL DEMONSTRATIONS COMPLETED SUCCESSFULLY!

Features Demonstrated:
   1. ✓ Math Operations (CGPA & Academic Metrics)
   2. ✓ Date/Time Operations (Calendar & Enrollment Duration)
   3. ✓ Colorful Console Output (Chalk library)
   4. ✓ Comprehensive Error Handling & Validation
   5. ✓ API Integration Testing (Axios)

═════════════════════════════════════════════════════════════════
```

---

## 🎯 Key Features Demonstrated

### ✅ Math Operations
- **CGPA Calculation:** Weighted average of grades × credits
- **Academic Metrics:** Total credits, failed courses, excellent courses
- **Calculation Formula:** 
  - Grade Points: A(4.0), B(3.5), C(3.0), D(2.5), F(0.0)
  - CGPA = Sum(Grade × Credits) / Total Credits

### ✅ Date/Time Operations
- **Academic Calendar:** Generate semester dates and countdown
- **Enrollment Duration:** Calculate years and months from enrollment date
- **Moment.js Formats:** DD-MM-YYYY, ISO 8601, Unix timestamp, timezone

### ✅ Colorful Output (Chalk)
- **Color Coding:** Grade colors (A=Green, B=Cyan, C=Yellow, D=Yellow+Black, F=Red)
- **Styled Boxes:** Using box drawing characters (╔═╗║╚═╝)
- **Emojis:** 🎓📊📅👤📚📌📍 etc.
- **Bold/Italic:** Text styling for emphasis

### ✅ Error Handling
- **Input Validation:** Grade validation, date format, age range, department
- **Try-Catch Blocks:** Comprehensive error catching
- **Error Messages:** User-friendly error descriptions
- **Graceful Failures:** API unavailable handling

### ✅ API Integration
- **Axios HTTP Client:** GET request to campus API
- **Health Check:** Verify backend server status
- **Timeout Handling:** 3-second timeout for API calls
- **Error Recovery:** Displays helpful message if API not available

---

## 📈 Dependencies Breakdown

### Core Dependencies:
1. **chalk** (4.1.2)
   - Terminal styling with 256+ colors
   - Background colors and text styles
   - Used in: logStudentInfo(), showModuleInfo(), validation messages

2. **moment** (2.29.4)
   - Date parsing and formatting
   - Timezone support
   - Date arithmetic (diff, add, subtract)
   - Used in: generateAcademicCalendar(), getEnrollmentDuration()

3. **axios** (1.6.2)
   - Promise-based HTTP requests
   - Error handling
   - Timeout support
   - Used in: API health check endpoint testing

### Dev Dependency:
1. **nodemon** (3.0.1)
   - Watches file changes
   - Auto-restarts Node process
   - Development server convenience
   - Scripts: npm start, npm run dev

---

## 🧪 Test Cases

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid CGPA | 4 courses, A/B grades | CGPA: 3.79 | ✅ PASS |
| Invalid Grade | Grade: X | Error message | ✅ PASS |
| Academic Metrics | 4 courses, 0 F grades | 0 failed, 2 A grades | ✅ PASS |
| Calendar Sem 1 | Semester: 1 | 256 days remaining | ✅ PASS |
| Calendar Sem 2 | Semester: 2 | 407 days remaining | ✅ PASS |
| Enrollment 1 | 2021-06-15 | 4 years, 9 months | ✅ PASS |
| Valid Student | All correct data | Valid: true | ✅ PASS |
| Invalid Student | Multiple errors | 5 errors found | ✅ PASS |
| Student Report | Complete student object | Formatted output | ✅ PASS |
| API Health Check | GET /api/health | Status 200, message | ✅ PASS |

---

## 📝 Code Highlights

### Error Handling Example:
```javascript
const result = campus.calculateCGPA([
  { courseName: 'Test', grade: 'X', credits: 3 }
]);
// Returns: { success: false, message: '❌ CGPA Calculation Error: ❌ Invalid grade: X...' }
```

### Validation Example:
```javascript
const validation = campus.validateStudent(student);
if (!validation.valid) {
  validation.errors.forEach(err => console.log(chalk.red(`❌ ${err}`)));
}
```

### Colorful Output Example:
```javascript
console.log(chalk.bold.cyan('Header'));
console.log(chalk.yellow('Label:'), chalk.greenBright('Value'));
console.log(chalk.red.bold('Error!'));
```

---

## 🔄 Nodemon Auto-Reload

When using `npm start` or `npm run dev`, nodemon watches for file changes:

```bash
$ npm start

> smart-campus-utils@1.0.0 dev
> nodemon index.js

[nodemon] 3.0.1
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
[nodemon] starting `node index.js`

[Output of program...]

[nodemon] restarting due to changes...
[nodemon] starting `node index.js`

[Output after file change...]
```

---

## 📚 Learning Outcomes

Students completing this exercise will understand:

1. **NPM Ecosystem:** Package management, dependencies, package.json configuration
2. **Custom Modules:** Creating reusable JavaScript classes and modules
3. **Third-party Libraries:** Integration with chalk, moment, and axios
4. **Error Handling:** Try-catch blocks, validation, error propagation
5. **Development Tools:** Nodemon for efficient development workflow
6. **API Integration:** HTTP requests using axios library
7. **Date/Time Operations:** Complex date calculations and formatting
8. **Console Output:** Advanced terminal styling and formatting

---

## 🎓 Topic Alignment: Smart Campus Management System

This exercise demonstrates practical utilities for a campus management system:

- **CGPA Calculation:** Academic performance tracking
- **Academic Calendar:** Semester and schedule management
- **Enrollment Duration:** Student tenure tracking
- **Student Validation:** Data integrity and quality assurance
- **API Integration:** Communication with campus systems
- **Colorful Reports:** User-friendly information presentation

---

## ✨ Summary

**Exercise 6** successfully demonstrates a complete custom NPM project with:
- ✅ 58 installed packages with proper dependency management
- ✅ 8 comprehensive utility functions for campus operations
- ✅ Multiple math, date/time, and string operations
- ✅ Colorful terminal output with chalk styling
- ✅ Comprehensive error handling and validation
- ✅ API integration with axios
- ✅ Development environment with nodemon
- ✅ Fully documented code with examples and explanations

**Status:** ✅ COMPLETE AND VERIFIED
