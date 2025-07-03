// cron/studentLoginReport.js
const User = require('../../models/Users');
const moment = require('moment');
const mongoService = require("../../config/mongoService");

const generateStudentLoginReport = async () => {
  console.log('⏰ Running student login report...');

  try {
    const users = await User.find({ role: 'student' });

    for (const user of users) {
      if (!user.lastLogin) continue;

      const today = moment();
      const lastLogin = moment(user.lastLogin);
      const diffDays = today.diff(lastLogin, 'days');

      const dataReport = await mongoService.findOne("Report", { studentId: user._id });

      if (dataReport) {
        await mongoService.updateOne(
          "Report",
          { _id: dataReport._id },
          { $set: { lastLogin: diffDays } }
        );
      } else {
        await mongoService.insertOne("Report", {
          studentId: user._id, 
          lastLogin: diffDays,
          lengthOfStay: "",
          accBalance: "",
          noShows: "",
          lcxl: "",
          ecxl: "",
          performance: "",
          actionTaken: "",
          outReach: "",
          instructorAccessment: "",
          isDeleted: false,
        });
      }

      console.log(`✅ Report saved for ${user.email} (${diffDays} days)`);
    }

  } catch (err) {
    console.error('❌ Error in report generation:', err);
  }
};

module.exports = generateStudentLoginReport;
