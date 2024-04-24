
var helpers = require("../helpers/helpers");
require("dotenv").config();
/**
 * LANGUAGE OBJECT
 * @param {OBJECT} data
 * @returns OBJECT
 */


async function languageObject(data) {
  var encryptFunc = await helpers.encryptData(data.id);
  roleResourcesData = {
    id: encryptFunc,
    languageName: data.languageName,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
   
  };


  return roleResourcesData;
}


module.exports = {
  languageObject,
};
