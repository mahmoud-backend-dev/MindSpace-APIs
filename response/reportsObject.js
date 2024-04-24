var common = require("./common");
var moment = require("moment");
/**
 * DATABASE
 */
const reportCollections = common.db.reports;
const usersCollection = common.db.users;
const appointmentCollection = common.db.appointments;

async function reportObjectRes(id, timeZone) {
  var data = await reportCollections.findOne({
    where: { id: id },
    include: [
      {
        model: appointmentCollection,
        as: "appointmentReport",
        attributes: ["appointmentDate", "slotStartTime"],
      },
      {
        model: usersCollection,
        as: "patientReports",
        attributes: ["firstName", "nickName"],
      },
      {
        model: usersCollection,
        as: "therapistReports",
        attributes: ["firstName"],
      },
    ],
  });

  var encryptId = await common.helpers.encryptData(data.id);

  var Obj = {
    id: encryptId,
    uuid: data.uuid,
    patientId: await common.helpers.encryptData(data.patientId),
    therapistId: await common.helpers.encryptData(data.therapistId),
    appointmentId: await common.helpers.encryptData(data.appointmentId),
    sessionSummary: data.sessionSummary,
    homeWork: data.homeWork,
    topicQuestions: data.topicQuestions,
    comments: data.comments,
    interventionNeeded: data.interventionNeeded,
    appointmentDate: data.appointmentReport.appointmentDate,
    appointmentSlotStartTime: data.appointmentReport.slotStartTime,
    patientName: data.patientReports.firstName
      ? data.patientReports.firstName
      : data.patientReports.nickName,
    therapisName: data.therapistReports.firstName,
    time: moment(data.createdAt).tz(timeZone).format("hh:mm A"),
    date: moment(data.createdAt).tz(timeZone).format("DD MMMM YYYY"),
    reportUrl: data.reportUrl ? data.reportUrl : "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
  return Obj;
}

module.exports = {
  reportObjectRes,
};
