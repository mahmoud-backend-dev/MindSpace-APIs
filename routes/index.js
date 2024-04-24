const admins = require("./adminRoute");
const users = require("./usersRoute");
const therapies = require("./therapyRoutes");
const notes = require("./notesRoutes");
const languages = require("./languageRoute");
const cms = require("./cmsRoute");
const appointment = require("./appointmentRoutes");
const contactUS = require("./contactUsRoute");
const feedback = require("./feedbackRoute");
const invoice = require("./invoiceRoutes");
const notification = require("./notificationRoutes");
const reviews = require("./reviewsRoutes");
const banners = require("./bannersRoutes");
const reports = require("./reportsRoutes");

module.exports = {
  admins,
  users,
  therapies,
  notes,
  languages,
  cms,
  appointment,
  contactUS,
  feedback,
  invoice,
  notification,
  reviews,
  banners,
  reports,
};
