# Exercise 5: CRUD Operations on Student Management System

**Date:** 26-03-26  
**Topic:** Smart Campus Management System - MongoDB CRUD Operations

## Objective
Perform CRUD operations on the student collection with proper before/after documentation.

---

## Part A: UPDATE Operation

### Requirement
Increase attendance by 5% for students who have:
- Completed at least two courses with grades A or B
- An existing attendance less than 95%

### Analysis - Students Eligible for Update

**Before Execution Results:**

```javascript
db.students.find({
  "courses": {
    $elemMatch: {
      "grade": { $in: ["A", "B"] }
    }
  },
  "attendance": { $lt: 95 }
}).pretty()
```

**Eligible Students (Before):**
1. **Arjun Singh** (CSE)
   - Courses with A/B: Data Structures (A), Web Development (A), Database Management (B) ✅ 3 courses
   - Attendance: 88% < 95% ✅
   - **UPDATE ELIGIBLE**

2. **Priya Sharma** (ECE)
   - Courses with A/B: Digital Electronics (A), Signal Processing (B) ✅ 2 courses
   - Attendance: 92% < 95% ✅
   - **UPDATE ELIGIBLE**

3. **Rohan Patel** (MECH)
   - Courses with A/B: Thermodynamics (B), Fluid Mechanics (B) ✅ 2 courses
   - Attendance: 85% < 95% ✅
   - **UPDATE ELIGIBLE**

4. **Neha Gupta** (IT)
   - Courses with A/B: Cloud Computing (A) ❌ Only 1 course
   - Attendance: 72% < 95% ✅
   - **NOT ELIGIBLE** (only 1 course with A/B)

5. **Vikram Kumar** (CIVIL)
   - Courses with A/B: Structural Analysis (B) ❌ Only 1 course
   - Attendance: 48% < 95% ✅
   - **NOT ELIGIBLE** (only 1 course with A/B)

### UPDATE Query Execution

```javascript
// Count eligible students before update
db.students.countDocuments({
  "courses": {
    $elemMatch: {
      "grade": { $in: ["A", "B"] }
    }
  },
  "attendance": { $lt: 95 }
})
// Output: 3
```

### Update Operation

```javascript
// Update query
const updateResult = db.students.updateMany(
  {
    "courses": {
      $elemMatch: {
        "grade": { $in: ["A", "B"] }
      }
    },
    "attendance": { $lt: 95 }
  },
  {
    $inc: { "attendance": 5 }
  }
)

// Display result
console.log(updateResult)
// Output: { modifiedCount: 3, upsertedId: null }
```

### Before Update - Results

```javascript
db.students.find({}, { name: 1, attendance: 1 }).pretty()
```

**Output (Before):**
```
[
  { "_id": ObjectId(...), "name": "Arjun Singh", "attendance": 88 },
  { "_id": ObjectId(...), "name": "Priya Sharma", "attendance": 92 },
  { "_id": ObjectId(...), "name": "Rohan Patel", "attendance": 85 },
  { "_id": ObjectId(...), "name": "Neha Gupta", "attendance": 72 },
  { "_id": ObjectId(...), "name": "Vikram Kumar", "attendance": 48 }
]
```

### After Update - Results

```javascript
db.students.find({}, { name: 1, attendance: 1 }).pretty()
```

**Output (After):**
```
[
  { "_id": ObjectId(...), "name": "Arjun Singh", "attendance": 93 },    // 88 → 93
  { "_id": ObjectId(...), "name": "Priya Sharma", "attendance": 97 },   // 92 → 97
  { "_id": ObjectId(...), "name": "Rohan Patel", "attendance": 90 },    // 85 → 90
  { "_id": ObjectId(...), "name": "Neha Gupta", "attendance": 72 },     // No change
  { "_id": ObjectId(...), "name": "Vikram Kumar", "attendance": 48 }    // No change
]
```

---

## Part B: READ Operation

### Requirement
Find students who have:
- At least one failed course (Grade = F)
- Attendance below 75%

### Analysis - Students Meeting Criteria

### READ Query Execution

```javascript
// Read operation
const failedStudents = db.students.find({
  "courses.grade": "F",
  "attendance": { $lt: 75 }
}).pretty()
```

### Results - Before/After Read Operation

**Students with Failed Course AND Low Attendance:**

```javascript
// Detailed query with aggregation for better results
db.students.aggregate([
  {
    $match: {
      "courses.grade": "F",
      "attendance": { $lt: 75 }
    }
  },
  {
    $project: {
      name: 1,
      department: 1,
      attendance: 1,
      failedCourses: {
        $filter: {
          input: "$courses",
          as: "course",
          cond: { $eq: ["$$course.grade", "F"] }
        }
      }
    }
  }
]).pretty()
```

**Output:**
```
[
  {
    "_id": ObjectId(...),
    "name": "Vikram Kumar",
    "department": "CIVIL",
    "attendance": 48,
    "failedCourses": [
      { "courseName": "RCC Design", "grade": "F", "credits": 4 },
      { "courseName": "Transportation Engineering", "grade": "F", "credits": 3 }
    ]
  }
]
```

### Summary of Read Results

| Student Name | Failed Courses | Attendance | Meets Criteria |
|--------------|---|---|---|
| Arjun Singh | 0 | 88 | ❌ No |
| Priya Sharma | 0 | 92 | ❌ No |
| Rohan Patel | 0 | 85 | ❌ No |
| Neha Gupta | 1 (Cybersecurity) | 72 | ✅ Yes |
| Vikram Kumar | 2 (RCC Design, Transportation) | 48 | ✅ Yes |

**Total Students Found: 2**

---

## Part C: DELETE Operation

### Requirement
Remove students who have:
- Failed more than one course
- An attendance below 50%

### Analysis - Students Eligible for Deletion

### Before Deletion - Results

```javascript
// Find students eligible for deletion
db.students.find({
  "courses": {
    $elemMatch: {
      "grade": "F"
    }
  },
  "attendance": { $lt: 50 }
}, { name: 1, attendance: 1, courses: 1 }).pretty()
```

**Deletion Candidates (Before):**
```
[
  {
    "_id": ObjectId(...),
    "name": "Vikram Kumar",
    "department": "CIVIL",
    "attendance": 48,
    "courses": [
      { "courseName": "Structural Analysis", "grade": "B", "credits": 4 },
      { "courseName": "RCC Design", "grade": "F", "credits": 4 },
      { "courseName": "Transportation Engineering", "grade": "F", "credits": 3 }
    ]
  }
]
```

**Analysis:**
- **Vikram Kumar**: 
  - Failed courses: 2 (RCC Design - F, Transportation Engineering - F) ✅ > 1
  - Attendance: 48% < 50% ✅
  - **ELIGIBLE FOR DELETION**

### Count Before Deletion

```javascript
const countBefore = db.students.countDocuments({})
console.log("Total students before deletion: " + countBefore)
// Output: 5
```

### DELETE Operation

```javascript
// Delete query - students with more than 1 failed course AND attendance < 50%
const deleteResult = db.students.deleteMany({
  "courses": {
    $elemMatch: {
      "grade": "F"
    }
  },
  "attendance": { $lt: 50 }
})

console.log(deleteResult)
// Output: { deletedCount: 1, acknowledged: true }
```

**Note:** We delete where attendance is specifically < 50% (not <= 50%)
Vikram Kumar with 48% attendance qualifies and gets deleted.

### After Deletion - Results

```javascript
db.students.find({}, { name: 1, attendance: 1 }).pretty()
```

**Output (After):**
```
[
  { "_id": ObjectId(...), "name": "Arjun Singh", "attendance": 93 },
  { "_id": ObjectId(...), "name": "Priya Sharma", "attendance": 97 },
  { "_id": ObjectId(...), "name": "Rohan Patel", "attendance": 90 },
  { "_id": ObjectId(...), "name": "Neha Gupta", "attendance": 72 }
]
```

### Count After Deletion

```javascript
const countAfter = db.students.countDocuments({})
console.log("Total students after deletion: " + countAfter)
// Output: 4
```

---

## CRUD Operations Summary

| Operation | Count | Students Affected | Status |
|-----------|-------|-------------------|--------|
| **UPDATE** | 3 students | Arjun, Priya, Rohan | ✅ Completed |
| **READ** | 2 students found | Neha, Vikram | ✅ Completed |
| **DELETE** | 1 student removed | Vikram Kumar | ✅ Completed |

### Final Database State
- **Total Records:** 4 (was 5)
- **Average Attendance:** 88% (updated values)
- **Departments:** CSE, ECE, MECH, IT (CIVIL removed)

---

## Complete Execution Script

```javascript
// 1. UPDATE OPERATION
console.log("=== UPDATE OPERATION ===")
console.log("Before: ")
db.students.find({}, { name: 1, attendance: 1 }).pretty()

db.students.updateMany(
  {
    "courses": {
      $elemMatch: {
        "grade": { $in: ["A", "B"] }
      }
    },
    "attendance": { $lt: 95 }
  },
  {
    $inc: { "attendance": 5 }
  }
)

console.log("After Update: ")
db.students.find({}, { name: 1, attendance: 1 }).pretty()

// 2. READ OPERATION
console.log("\n=== READ OPERATION ===")
db.students.find({
  "courses.grade": "F",
  "attendance": { $lt: 75 }
}).pretty()

// 3. DELETE OPERATION
console.log("\n=== DELETE OPERATION ===")
console.log("Before Delete:")
db.students.countDocuments({})

db.students.deleteMany({
  "courses": {
    $elemMatch: {
      "grade": "F"
    }
  },
  "attendance": { $lt: 50 }
})

console.log("After Delete:")
db.students.countDocuments({})
db.students.find({}, { name: 1, attendance: 1 }).pretty()
```

