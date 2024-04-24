var helpers = require("../helpers/helpers");

/**
 * CMS OBJECT
 * @param {OBJECT} data
 * @returns OBJECT
 */
async function feedbackObjectRes(data) {
  cmsData = {
    id: await helpers.encryptData(data.id),
    patientId: await helpers.encryptData(data.patientId),
    therapistId: await helpers.encryptData(data.therapistId),
    feedback: data.feedback,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return cmsData;
}

module.exports = {
  feedbackObjectRes,
};
