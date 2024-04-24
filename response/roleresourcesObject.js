
var helpers = require("../helpers/helpers");
require("dotenv").config();
/**
 * ROLE RESOURCES OBJECT
 * @param {OBJECT} data
 * @param {STRING} token
 * @returns OBJECT
 */


async function roleresourcesObject(data) {
  var encryptFunc = await helpers.encryptData(data.id);
  roleResourcesData = {
    id: encryptFunc,
    resourceName: data.resourceName,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
   
  };


  return roleResourcesData;
}


module.exports = {
  roleresourcesObject,
};
