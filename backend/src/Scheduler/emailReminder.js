const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Assignment = require("../Model/assignmentModel");
const CourseOrder = require("../Model/courseOrderModel");
const User = require("../Model/userModel");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

const sentReminders = new Set(); 

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("⏰ Running assignment reminder scheduler...");

  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
  const inOneDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingAssignments = await Assignment.find({
    dueDate: { $gte: now, $lte: inOneDay },
  });

  for (const assignment of upcomingAssignments) {
    const dueDate = new Date(assignment.dueDate);
    const assignmentId = assignment._id.toString();

    const timeDiff = dueDate - now;
    const isOneHour = timeDiff <= 60 * 60 * 1000;
    const isOneDay = timeDiff <= 24 * 60 * 60 * 1000 && timeDiff > 60 * 60 * 1000;

    const reminderKey = `${assignmentId}_${isOneHour ? "1h" : "1d"}`;
    if (sentReminders.has(reminderKey)) continue;

    let students = [];

    if (assignment.assignToAll) {
      const enrolled = await CourseOrder.find({
        "course.courseId": assignment.courseId,
        enrollmentStatus: "ACTIVE",
      }).populate("userId", "email firstName");

      students = enrolled.map((e) => e.userId);
    } else {
      students = await User.find({ _id: { $in: assignment.assignTo } }, "email firstName");
    }

    // Send emails
    for (const student of students) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: `Reminder: "${assignment.title}" is due soon!`,
        html: `
          <p>Hi ${student.firstName || "Student"},</p>
          <p>This is a reminder that your assignment <strong>"${assignment.title}"</strong> is due on <strong>${dueDate.toLocaleString()}</strong>.</p>
          <p>Make sure to submit it before the deadline.</p>
          <p>Thanks,<br/>SipalayInfoTech</p>
        `,
      });
    }

    sentReminders.add(reminderKey);
  }
});
