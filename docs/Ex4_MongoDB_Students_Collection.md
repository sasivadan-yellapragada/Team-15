# Exercise 4: Student Management System - MongoDB Collection Setup

**Date:** 18-03-26  
**Topic:** Smart Campus Management System

## Objective
Create a MongoDB collection named `students` with proper schema and insert at least 5 unique student records following the specified requirements.

---

## MongoDB Schema Structure

```javascript
{
  _id: ObjectId,
  name: String,                    // Student's full name
  age: Number,                     // Age of the student
  department: String,              // CSE, ECE, MECH, IT, CIVIL
  courses: [
    {
      courseName: String,          // Name of the course
      grade: String,               // A, B, C, D, F
      credits: Number             // Credit hours
    }
  ],
  attendance: Number               // Percentage (0-100)
}
```

---

## Student Records to Insert

### Record 1: Arjun Singh (CSE Department)
```javascript
{
  name: "Arjun Singh",
  age: 20,
  department: "CSE",
  courses: [
    {
      courseName: "Data Structures",
      grade: "A",
      credits: 4
    },
    {
      courseName: "Web Development",
      grade: "A",
      credits: 3
    },
    {
      courseName: "Database Management",
      grade: "B",
      credits: 4
    }
  ],
  attendance: 88
}
```

### Record 2: Priya Sharma (ECE Department)
```javascript
{
  name: "Priya Sharma",
  age: 19,
  department: "ECE",
  courses: [
    {
      courseName: "Digital Electronics",
      grade: "A",
      credits: 4
    },
    {
      courseName: "Signal Processing",
      grade: "B",
      credits: 3
    },
    {
      courseName: "Microprocessors",
      grade: "C",
      credits: 4
    }
  ],
  attendance: 92
}
```

### Record 3: Rohan Patel (MECH Department)
```javascript
{
  name: "Rohan Patel",
  age: 21,
  department: "MECH",
  courses: [
    {
      courseName: "Thermodynamics",
      grade: "B",
      credits: 4
    },
    {
      courseName: "Fluid Mechanics",
      grade: "B",
      credits: 4
    },
    {
      courseName: "Machine Design",
      grade: "C",
      credits: 3
    }
  ],
  attendance: 85
}
```

### Record 4: Neha Gupta (IT Department)
```javascript
{
  name: "Neha Gupta",
  age: 20,
  department: "IT",
  courses: [
    {
      courseName: "Cloud Computing",
      grade: "A",
      credits: 4
    },
    {
      courseName: "Cybersecurity",
      grade: "F",
      credits: 3
    },
    {
      courseName: "IT Infrastructure",
      grade: "D",
      credits: 3
    }
  ],
  attendance: 72
}
```

### Record 5: Vikram Kumar (CIVIL Department)
```javascript
{
  name: "Vikram Kumar",
  age: 22,
  department: "CIVIL",
  courses: [
    {
      courseName: "Structural Analysis",
      grade: "B",
      credits: 4
    },
    {
      courseName: "RCC Design",
      grade: "F",
      credits: 4
    },
    {
      courseName: "Transportation Engineering",
      grade: "F",
      credits: 3
    }
  ],
  attendance: 48
}
```

---

## MongoDB Connection & Insertion Script

### Step 1: Connect to MongoDB
```bash
mongosh
```

### Step 2: Select Database
```javascript
use smart_campus_db
```

### Step 3: Create Collection and Insert Records
```javascript
// Create collection with validation
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age", "department", "courses", "attendance"],
      properties: {
        name: { bsonType: "string" },
        age: { bsonType: "int" },
        department: { enum: ["CSE", "ECE", "MECH", "IT", "CIVIL"] },
        courses: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["courseName", "grade", "credits"],
            properties: {
              courseName: { bsonType: "string" },
              grade: { enum: ["A", "B", "C", "D", "F"] },
              credits: { bsonType: "int" }
            }
          }
        },
        attendance: { bsonType: "double", minimum: 0, maximum: 100 }
      }
    }
  }
})
```

### Step 4: Insert All Records
```javascript
db.students.insertMany([
  {
    name: "Arjun Singh",
    age: 20,
    department: "CSE",
    courses: [
      { courseName: "Data Structures", grade: "A", credits: 4 },
      { courseName: "Web Development", grade: "A", credits: 3 },
      { courseName: "Database Management", grade: "B", credits: 4 }
    ],
    attendance: 88
  },
  {
    name: "Priya Sharma",
    age: 19,
    department: "ECE",
    courses: [
      { courseName: "Digital Electronics", grade: "A", credits: 4 },
      { courseName: "Signal Processing", grade: "B", credits: 3 },
      { courseName: "Microprocessors", grade: "C", credits: 4 }
    ],
    attendance: 92
  },
  {
    name: "Rohan Patel",
    age: 21,
    department: "MECH",
    courses: [
      { courseName: "Thermodynamics", grade: "B", credits: 4 },
      { courseName: "Fluid Mechanics", grade: "B", credits: 4 },
      { courseName: "Machine Design", grade: "C", credits: 3 }
    ],
    attendance: 85
  },
  {
    name: "Neha Gupta",
    age: 20,
    department: "IT",
    courses: [
      { courseName: "Cloud Computing", grade: "A", credits: 4 },
      { courseName: "Cybersecurity", grade: "F", credits: 3 },
      { courseName: "IT Infrastructure", grade: "D", credits: 3 }
    ],
    attendance: 72
  },
  {
    name: "Vikram Kumar",
    age: 22,
    department: "CIVIL",
    courses: [
      { courseName: "Structural Analysis", grade: "B", credits: 4 },
      { courseName: "RCC Design", grade: "F", credits: 4 },
      { courseName: "Transportation Engineering", grade: "F", credits: 3 }
    ],
    attendance: 48
  }
])
```

### Step 5: Verify Records Inserted
```javascript
db.students.find().pretty()
```

---

## Expected Output

```json
[
  {
    "_id": ObjectId("..."),
    "name": "Arjun Singh",
    "age": 20,
    "department": "CSE",
    "courses": [
      {
        "courseName": "Data Structures",
        "grade": "A",
        "credits": 4
      },
      {
        "courseName": "Web Development",
        "grade": "A",
        "credits": 3
      },
      {
        "courseName": "Database Management",
        "grade": "B",
        "credits": 4
      }
    ],
    "attendance": 88
  },
  // ... more records
]
```

---

## Key Requirements Met ✅

| Requirement | Status |
|------------|--------|
| 5 unique student records | ✅ Created |
| No duplicate names | ✅ All unique names |
| Different departments | ✅ CSE, ECE, MECH, IT, CIVIL |
| At least 2 courses each | ✅ 3 courses per student |
| Course details (name, grade, credits) | ✅ Complete |
| Attendance percentage | ✅ Ranging 48-92% |
| Valid grade values (A-F) | ✅ All valid |

---

## Collection Statistics
- **Total Records:** 5
- **Departments Covered:** 5 (CSE, ECE, MECH, IT, CIVIL)
- **Total Courses:** 15
- **Average Attendance:** 77%
- **Records with A grades:** 5
- **Records with F grades:** 3

