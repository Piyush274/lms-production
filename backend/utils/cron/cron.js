// cron/cron.js
const cron = require('node-cron');
const generateStudentLoginReport = require('./studentLoginReport');

cron.schedule('0 0 * * *', generateStudentLoginReport);
