/**
 * CampusModule.js
 * Custom module for Smart Campus Management System
 * Performs: Math operations, Date/Time operations, Colorful logging, Error handling
 */

const chalk = require('chalk');
const moment = require('moment');

/**
 * CampusModule - Custom Module for Campus Operations
 */
class CampusModule {
  constructor() {
    this.moduleName = "Smart Campus Utilities";
    this.version = "1.0.0";
  }

  /**
   * Math Operation: Calculate CGPA from grades and credits
   * CGPA = Sum of (Grade Points × Credits) / Total Credits
   * A=4.0, B=3.5, C=3.0, D=2.5, F=0.0
   */
  calculateCGPA(courses) {
    try {
      if (!courses || courses.length === 0) {
        throw new Error("❌ No courses provided for CGPA calculation");
      }

      const gradePoints = {
        'A': 4.0,
        'B': 3.5,
        'C': 3.0,
        'D': 2.5,
        'F': 0.0
      };

      let totalGradePoints = 0;
      let totalCredits = 0;

      courses.forEach(course => {
        if (!gradePoints.hasOwnProperty(course.grade)) {
          throw new Error(`❌ Invalid grade: ${course.grade}. Must be A, B, C, D, or F`);
        }

        const points = gradePoints[course.grade] * course.credits;
        totalGradePoints += points;
        totalCredits += course.credits;
      });

      if (totalCredits === 0) {
        throw new Error("❌ Total credits cannot be zero");
      }

      const cgpa = (totalGradePoints / totalCredits).toFixed(2);
      return {
        success: true,
        cgpa: cgpa,
        message: `✅ CGPA calculated successfully: ${cgpa}`
      };
    } catch (error) {
      return {
        success: false,
        cgpa: null,
        message: `❌ CGPA Calculation Error: ${error.message}`
      };
    }
  }

  /**
   * Math Operation: Calculate total credit hours and weighted score
   */
  calculateAcademicMetrics(courses) {
    try {
      if (!courses || courses.length === 0) {
        throw new Error("❌ No courses provided");
      }

      let totalCredits = 0;
      let failedCourses = 0;
      let excellentCourses = 0;

      courses.forEach(course => {
        totalCredits += course.credits;
        if (course.grade === 'F') failedCourses++;
        if (course.grade === 'A') excellentCourses++;
      });

      return {
        success: true,
        totalCredits: totalCredits,
        failedCourses: failedCourses,
        excellentCourses: excellentCourses,
        message: `✅ Metrics calculated: ${totalCredits} credits, ${failedCourses} failed, ${excellentCourses} excellent`
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Academic Metrics Error: ${error.message}`
      };
    }
  }

  /**
   * Date/Time Operation: Generate academic calendar
   */
  generateAcademicCalendar(semester) {
    try {
      if (!semester || (semester !== 1 && semester !== 2)) {
        throw new Error("❌ Invalid semester. Must be 1 or 2");
      }

      const currentYear = moment().year();
      const academicYear = `${currentYear}-${currentYear + 1}`;

      let startDate, endDate;
      if (semester === 1) {
        startDate = moment(`${currentYear}-08-01`);
        endDate = moment(`${currentYear}-11-30`);
      } else {
        startDate = moment(`${currentYear + 1}-01-01`);
        endDate = moment(`${currentYear + 1}-04-30`);
      }

      return {
        success: true,
        academicYear: academicYear,
        semester: `Semester ${semester}`,
        startDate: startDate.format('DD-MM-YYYY'),
        endDate: endDate.format('DD-MM-YYYY'),
        daysRemaining: endDate.diff(moment(), 'days'),
        message: `✅ Calendar generated for ${academicYear}, Sem ${semester}`
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Calendar Generation Error: ${error.message}`
      };
    }
  }

  /**
   * Date/Time Operation: Get student enrollment duration
   */
  getEnrollmentDuration(enrollmentDate) {
    try {
      const enrollDate = moment(enrollmentDate, 'DD-MM-YYYY');
      
      if (!enrollDate.isValid()) {
        throw new Error("❌ Invalid enrollment date format. Use DD-MM-YYYY");
      }

      const today = moment();
      const duration = today.diff(enrollDate, 'months');
      const years = Math.floor(duration / 12);
      const months = duration % 12;

      return {
        success: true,
        enrollmentDate: enrollDate.format('DD-MM-YYYY'),
        daysEnrolled: today.diff(enrollDate, 'days'),
        durationFormatted: `${years} years, ${months} months`,
        message: `✅ Student enrolled for ${years}y ${months}m`
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Enrollment Duration Error: ${error.message}`
      };
    }
  }

  /**
   * Colorful Console Output with Chalk
   */
  logStudentInfo(student) {
    try {
      if (!student || !student.name) {
        throw new Error("❌ Invalid student object");
      }

      console.log(chalk.bold.cyan('\n╔════════════════════════════════════════╗'));
      console.log(chalk.bold.cyan('║   STUDENT INFORMATION REPORT           ║'));
      console.log(chalk.bold.cyan('╚════════════════════════════════════════╝\n'));

      console.log(chalk.yellow.bold('📌 Personal Details:'));
      console.log(chalk.white(`   Name: ${chalk.greenBright.bold(student.name)}`));
      console.log(chalk.white(`   Age: ${chalk.greenBright.bold(student.age)} years`));
      console.log(chalk.white(`   Department: ${chalk.greenBright.bold(student.department)}`));
      console.log(chalk.white(`   Attendance: ${chalk.greenBright.bold(student.attendance + '%')}\n`));

      console.log(chalk.yellow.bold('📚 Courses:'));
      student.courses.forEach((course, index) => {
        const gradeColor = this.getGradeColor(course.grade);
        console.log(chalk.white(`   ${index + 1}. ${course.courseName}`));
        console.log(chalk.white(`      Grade: ${gradeColor(course.grade)} | Credits: ${course.credits}`));
      });

      console.log(chalk.cyan('\n═════════════════════════════════════════\n'));
    } catch (error) {
      console.log(chalk.red.bold(`❌ Logging Error: ${error.message}`));
    }
  }

  /**
   * Helper: Get color based on grade
   */
  getGradeColor(grade) {
    const colors = {
      'A': chalk.greenBright,
      'B': chalk.cyanBright,
      'C': chalk.yellowBright,
      'D': chalk.bgYellow.black,
      'F': chalk.redBright
    };
    return colors[grade] || chalk.white;
  }

  /**
   * Error Handling: Validate student data
   */
  validateStudent(student) {
    try {
      const errors = [];

      // Validate name
      if (!student.name || typeof student.name !== 'string' || student.name.trim() === '') {
        errors.push("Name is required and must be a non-empty string");
      }

      // Validate age
      if (!Number.isInteger(student.age) || student.age < 15 || student.age > 35) {
        errors.push("Age must be an integer between 15 and 35");
      }

      // Validate department
      const validDepts = ['CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
      if (!validDepts.includes(student.department)) {
        errors.push(`Department must be one of: ${validDepts.join(', ')}`);
      }

      // Validate courses
      if (!Array.isArray(student.courses) || student.courses.length < 2) {
        errors.push("Student must have at least 2 courses");
      } else {
        student.courses.forEach((course, idx) => {
          if (!course.courseName || typeof course.courseName !== 'string') {
            errors.push(`Course ${idx + 1}: Invalid course name`);
          }
          if (!['A', 'B', 'C', 'D', 'F'].includes(course.grade)) {
            errors.push(`Course ${idx + 1}: Grade must be A, B, C, D, or F`);
          }
          if (!Number.isInteger(course.credits) || course.credits < 1 || course.credits > 5) {
            errors.push(`Course ${idx + 1}: Credits must be between 1 and 5`);
          }
        });
      }

      // Validate attendance
      if (typeof student.attendance !== 'number' || student.attendance < 0 || student.attendance > 100) {
        errors.push("Attendance must be a number between 0 and 100");
      }

      if (errors.length > 0) {
        return {
          valid: false,
          errors: errors,
          message: chalk.red(`❌ Validation failed with ${errors.length} error(s)`)
        };
      }

      return {
        valid: true,
        errors: [],
        message: chalk.green("✅ Student data is valid!")
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error.message],
        message: chalk.red(`❌ Validation Error: ${error.message}`)
      };
    }
  }

  /**
   * Display module info
   */
  showModuleInfo() {
    console.log(chalk.bold.magenta('\n╔═══════════════════════════════════════╗'));
    console.log(chalk.bold.magenta('║      CAMPUS MODULE INFORMATION        ║'));
    console.log(chalk.bold.magenta('╚═══════════════════════════════════════╝\n'));
    console.log(chalk.cyan(`Module: ${this.moduleName}`));
    console.log(chalk.cyan(`Version: ${this.version}`));
    console.log(chalk.cyan(`Created: ${moment().format('DD-MM-YYYY HH:mm:ss')}\n`));
  }
}

// Export the module
module.exports = CampusModule;
