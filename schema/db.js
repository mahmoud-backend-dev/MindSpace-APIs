const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      collate: "utf8_general_ci",
    },
    logQueryParameters: true,
    logging: false,
    freezeTableName: true,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

/**
 * CREATE AND ACCESS PERTICULLER DATA TABLE
 */
db.users = require("./userSchema")(sequelize, Sequelize);
db.otps = require("./otpSchema")(sequelize, Sequelize);
db.professional = require("./professionalDetailsSchema")(sequelize, Sequelize);
db.therapies = require("./therapiesSchema")(sequelize, Sequelize);
db.bankDetails = require("./bankingDetailsSchema")(sequelize, Sequelize);
db.certifications = require("./certificationsSchema")(sequelize, Sequelize);
db.userTherapies = require("./userTherapiesSchema")(sequelize, Sequelize);
db.employmentHistory = require("./employmentSchema")(sequelize, Sequelize);
db.admin = require("./adminSchema")(sequelize, Sequelize);
db.roleResources = require("./roleResourcesSchema")(sequelize, Sequelize);
db.assignRoleResources = require("./assignRoleResourcesSchema")(
  sequelize,
  Sequelize
);
db.journals = require("./journalSchema")(sequelize, Sequelize);
db.language = require("./languageSchema")(sequelize, Sequelize);
db.cms = require("./cmsSchema")(sequelize, Sequelize);
db.appointments = require("./appointmentSchema")(sequelize, Sequelize);
db.therapistLanguages = require("./therapistLanguageSchema")(
  sequelize,
  Sequelize
);
db.therapistWorkDays = require("./workDaysSchema")(sequelize, Sequelize);
db.therapistLeaveDays = require("./leaveSchema")(sequelize, Sequelize);
db.contactUs = require("./contactUsSchema")(sequelize, Sequelize);
db.feedback = require("./feedbackSchema")(sequelize, Sequelize);
db.chat = require("./chatSchema")(sequelize, Sequelize);
db.chatConversation = require("./chatConversationSchema")(sequelize, Sequelize);
db.chatMaster = require("./chatmasterSchema")(sequelize, Sequelize);

db.notifications = require("./notificationSchema")(sequelize, Sequelize);
db.userNotifications = require("./usersNotificationsSchema")(
  sequelize,
  Sequelize
);

db.chat = require("./chatSchema")(sequelize, Sequelize);
db.chatConversation = require("./chatConversationSchema")(sequelize, Sequelize);
db.chatMaster = require("./chatmasterSchema")(sequelize, Sequelize);
db.payment = require("./paymentSchema")(sequelize, Sequelize);
db.reviews = require("./reviewsSchema")(sequelize, Sequelize);
db.banners = require("./bannerSchema")(sequelize, Sequelize);
db.reports = require("./reportSchema")(sequelize, Sequelize);


/**
 * Reviews Assocations
 */
db.users.hasMany(db.reviews, {
  sourceKey: "id",
  foreignKey: "patientId",
  as: "patientReviews",
});
db.users.hasMany(db.reviews, {
  sourceKey: "id",
  foreignKey: "therapistId",
  as: "therapistReviews",
});

db.reviews.belongsTo(db.users, {
  foreignKey: "therapistId",
  sourceKey: "id",
  as: "therapistReviews",
});
db.reviews.belongsTo(db.users, {
  foreignKey: "patientId",
  sourceKey: "id",
  as: "patientReviews",
});

/**
 * payment Assocations
 */
db.appointments.hasOne(db.payment, {
  sourceKey: "id",
  foreignKey: "appointmentId",
  as: "payment",
});

db.payment.belongsTo(db.appointments, {
  foreignKey: "appointmentId",
  sourceKey: "id",
  as: "payment",
});

/**
 * users Assocations
 */
db.users.hasMany(db.professional, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "professionalDetails",
});
db.professional.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "users",
});

db.professional.hasMany(db.employmentHistory, {
  sourceKey: "id",
  foreignKey: "professionalId",
  as: "empHistory",
});
db.employmentHistory.belongsTo(db.professional, {
  foreignKey: "professionalId",
  sourceKey: "id",
  as: "empProffesion",
});
db.users.hasMany(db.bankDetails, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "bankDetails",
});

db.bankDetails.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "users",
});

/* Notification Assocation with user*/
db.notifications.hasMany(db.userNotifications, {
  sourceKey: "id",
  foreignKey: "notificationId",
  as: "notifications",
});

db.userNotifications.belongsTo(db.notifications, {
  foreignKey: "notificationId",
  sourceKey: "id",
  as: "notifications",
});
db.users.hasMany(db.userNotifications, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "userNotifications",
});
db.userNotifications.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "userNotifications",
});

/* workDays of therapist Assocation with user */
db.users.hasMany(db.therapistWorkDays, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "therapistWorkDays",
});

db.therapistWorkDays.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "usersWorkDays",
});
/* Leave Days od therapist Assocation with user */
db.users.hasMany(db.therapistLeaveDays, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "therapistLeaveDays",
});
db.therapistLeaveDays.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "usersLeaveDays",
});

/* Therapist Language  Assocation with user */
db.users.hasMany(db.therapistLanguages, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "therapistlanguages",
});

/* appointment Assocation with user */

db.users.hasMany(db.appointments, {
  sourceKey: "id",
  foreignKey: "patientId",
  as: "patientAppointments",
});
db.users.hasMany(db.appointments, {
  sourceKey: "id",
  foreignKey: "therapistId",
  as: "therapistAppointments",
});

db.appointments.belongsTo(db.users, {
  foreignKey: "therapistId",
  sourceKey: "id",
  as: "therapistAppointments",
});
db.appointments.belongsTo(db.users, {
  foreignKey: "patientId",
  sourceKey: "id",
  as: "patientAppointments",
});

/** certifications Assocation with user change to hasMany  */
db.users.hasMany(db.certifications, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "certifications",
});

db.certifications.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "users",
});

db.users.hasMany(db.userTherapies, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "userTherapies",
});
db.therapies.hasMany(db.userTherapies, {
  sourceKey: "id",
  foreignKey: "therapiId",
  as: "userTherapies",
});

db.userTherapies.belongsTo(db.therapies, {
  foreignKey: "therapiId",
  sourceKey: "id",
  as: "therapies",
});
db.userTherapies.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "userTherapies",
});

db.users.hasMany(db.employmentHistory, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "employmentHistory",
});

db.employmentHistory.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "users",
});

db.users.hasMany(db.journals, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "journals",
});

db.journals.belongsTo(db.users, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "usersjournals",
});

/**
 * admins assocation with assignroleresources
 */

db.admin.hasMany(db.assignRoleResources, {
  sourceKey: "id",
  foreignKey: "adminId",
  as: "roleAssign",
});

db.assignRoleResources.belongsTo(db.admin, {
  sourceKey: "id",
  foreignKey: "adminId",
  as: "roleAssign",
});
/**
 * admins assocation with assignroleresources
 */

db.roleResources.hasOne(db.assignRoleResources, {
  sourceKey: "id",
  foreignKey: "roleResourceId",
  as: "resources",
});

db.assignRoleResources.belongsTo(db.roleResources, {
  sourceKey: "id",
  foreignKey: "roleResourceId",
  as: "resources",
});

/**
 * Banner Assocations with users
 */
db.users.hasOne(db.banners, {
  sourceKey: "id",
  foreignKey: "therapistId",
  as: "therapistBanners",
});
db.banners.belongsTo(db.users, {
  foreignKey: "therapistId",
  sourceKey: "id",
  as: "therapistBanners",
});

/* Report Assocation with users */

db.users.hasMany(db.reports, {
  sourceKey: "id",
  foreignKey: "patientId",
  as: "patientReports",
});

db.users.hasMany(db.reports, {
  sourceKey: "id",
  foreignKey: "therapistId",
  as: "therapistReports",
});

db.reports.belongsTo(db.users, {
  foreignKey: "therapistId",
  sourceKey: "id",
  as: "therapistReports",
});

db.reports.belongsTo(db.users, {
  foreignKey: "patientId",
  sourceKey: "id",
  as: "patientReports",
});

/** Report Assocation  with Appointment  */

db.appointments.hasOne(db.reports, {
  sourceKey: "id",
  foreignKey: "appointmentId",
  as: "appointmentReport",
});

db.reports.belongsTo(db.appointments, {
  foreignKey: "appointmentId",
  sourceKey: "id",
  as: "appointmentReport",
});

module.exports = db;
