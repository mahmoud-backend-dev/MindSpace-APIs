var helpers = require("../helpers/helpers");

/**
 * CMS OBJECT
 * @param {OBJECT} data
 * @returns OBJECT
 */
async function constactUsObjectRes(data) {
  cmsData = {
    id: await helpers.encryptData(data.id),
    userId: await helpers.encryptData(data.userId),
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  return cmsData;
}

module.exports = {
  constactUsObjectRes,
};
