/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */

const adminsCollection = common.db.admin;
const assignRoleResources = common.db.assignRoleResources;
const roleResources = common.db.roleResources;

/**
 * GET Admin DETAILS BY ID
 * @param {Object} req
 * @returns Object
 */
module.exports.get = async (req) => {
  
  try {
    var errorArray = [];
    var errorFlag = 0;
    if (req.params.id != "" && typeof req.params.id != "undefined") {
      var decryptId = await common.helpers.decryptData(req.params.id);

      if (decryptId != false) {
        var usersDetails = await common.query.findOne(adminsCollection, {
          where: { id: decryptId },
          include: [
            {
              model: assignRoleResources,
              as: "roleAssign",
              attributes: ["id", "roleResourceId", "adminId", "status"],
              include: [
                {
                  model: roleResources,
                  as: "resources",
                  attributes: ["resourceName", "id"],
                },
              ],
            },
          ],
        });

        if (usersDetails == null) {
          /**
           * USER NOT FOUND
           */
          errorFlag = 1;
          var successOrError =
          await common.responseServices.successOrErrors("err_17");
          var resobj = await common.responseModel.resObj(
            successOrError.code,
            successOrError.message,
            successOrError.parameters.psychicId,
            successOrError.location
          );
          errorArray.push(resobj);
        }
      } else {
        /**
         * INVALID USER ID
         */
        errorFlag = 1;
        var successOrError = await common.responseServices.successOrErrors("err_57");

        var resobj = await common.responseModel.resObj(
          successOrError.code,
          successOrError.message,
          successOrError.parameters.psychicId,
          successOrError.location
        );
        errorArray.push(resobj);
      }
    } else {
      /**
       * INVALID USER ID
       */
      errorFlag = 1;
      var successOrError = await common.responseServices.successOrErrors("err_17");
      var resobj = await common.responseModel.resObj(
        successOrError.code,
        successOrError.message,
        successOrError.parameters.psychicId,
        successOrError.location
      );
      errorArray.push(resobj);
    }

    if (errorArray.length >= 0 && errorFlag == 1) {
      return await common.responseModel.failResponse("Errors", {}, errorArray);
    } else {
      /**
       * SUCCESS RESPONSE
       */


      const assignArr = [];

      for (let index = 0; index < usersDetails.roleAssign.length; index++) {
        const element = usersDetails.roleAssign[index];

        const assignObj = {
          id: await common.helpers.encryptData(element.id),
          roleResourceId: await common.helpers.encryptData(
            element.roleResourceId
          ),
          status: element.status,
          status: element.status,
          resourceName: element.resources.resourceName,
        };
        assignArr.push(assignObj);
      }

      var response = await common.response.admins.adminAssocationObjectRes(
        usersDetails,
        assignArr
      );
      var successOrError =
      await  common.responseServices.successOrErrors("successMessage");
      return await common.responseModel.successResponse(
        successOrError.success,
        response,
        []
      );
    }
  } catch (error) {
    /**
     * CATCH ERROR
     */
    var successOrError = await common.responseServices.successOrErrors("ex_00");
    var resobj = await common.responseModel.resObj(
      successOrError.code,
      error.message,
      successOrError.parameters.noParams,
      successOrError.location
    );
    var array = [];
    array.push(resobj);
    return await common.responseModel.failResponse(successOrError.failMsg, {}, array);
  }
};
