/**
 * NPM PACKAGE
 */
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

/**
 * HELPERS
 */
var common = require("../common");
const bucketName = process.env.AWS_BUCKETNAME;
const profileImage = process.env.AWS_UPLOAD_PATH_FOR_PROFILE;
/**
 * DATABASE
 */
const adminsCollection = common.db.admin;

/**
 *
 * ADMIN UPDATE DETAILS FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.update = async (req) => {

  try {
    var errorFlag = 0;
    var errorArray = [];
    /**
     * ADMIN ID VALIDATION
     */
    if (req.params.id) {
      var decryptId = await common.helpers.decryptData(req.params.id);

      if (decryptId != false) {
        var adminIdQuery = { where: { id: decryptId } };
        var adminsDetails = await common.query.findOne(
          adminsCollection,
          adminIdQuery
        );

        var adminsObject = {};

        if (adminsDetails != null) {
          /**
           * UPDATE FIRSTNAME THEN CALL THIS CONDITION
           */
          if (
            req.body.fullName != "" &&
            typeof req.body.fullName != "undefined"
          ) {
            var validationFirstName = await common.helpers.nameValidation(
              req.body.fullName
            );

            if (validationFirstName == false) {
              /**
               * FIRST NAME VALIDATION
               */
              errorFlag = 1;
              var successOrError =
              await   common.responseServices.successOrErrors("err_43");
              var resobj = await common.responseModel.resObj(
                successOrError.code,
                successOrError.message,
                successOrError.parameters.fullName,
                successOrError.location
              );
              errorArray.push(resobj);
            } else {
              adminsObject.fullName = req.body.fullName
                ? req.body.fullName
                : adminsDetails.dataValues.fullName;
            }
          } else {
            adminsObject.fullName = req.body.fullName;
          }

          /**
           * UPDATE ASSIGN_ROLE THEN CALL THIS CONDITION
           */
          if (
            req.body.assignRole != "" &&
            typeof req.body.assignRole != "undefined"
          ) {
            adminsObject.assignRole = req.body.assignRole
              ? req.body.assignRole
              : adminsDetails.dataValues.assignRole;
          } else {
            adminsObject.assignRole = req.body.assignRole;
          }

          /**
           * UPDATE PHONE  THEN CALL THIS CONDITION
           */
          if (req.body.phone != "" && typeof req.body.phone != "undefined") {
            var validationPhone = await common.helpers.checkPhone(
              req.body.phone
            );

            if (validationPhone == false) {
              /**
               * PHONE NAME VALIDATION
               */
              errorFlag = 1;
              var successOrError =
              await  common.responseServices.successOrErrors("err_119");
              var resobj = await common.responseModel.resObj(
                successOrError.code,
                successOrError.message,
                successOrError.parameters.fullName,
                successOrError.location
              );
              errorArray.push(resobj);
            } else {
              adminsObject.phone = req.body.phone
                ? req.body.phone
                : adminsDetails.dataValues.phone;
            }
          } else {
            adminsObject.phone = req.body.phone;
          }

          /**
           * UPDATE EMAIL THEN CALL THIS CONDITION
           */
          if (
            req.body.email != "" &&
            typeof req.body.email != "undefined" &&
            typeof req.body.email == "string"
          ) {
            var emailValidation = await common.helpers.validateEmail(
              req.body.email
            );
            var adminEmailQuery = { email: req.body.email };
            var adminDetails = await common.query.findSome(
              adminsCollection,
              adminEmailQuery
            );
            var filter = adminDetails.filter(
              (item) => item.dataValues.id != decryptId
            );

            if (filter.length != 0) {
              /**
               * EMAIL ALREADY EXITS
               */
              errorFlag = 1;
              var successOrError =
              await common.responseServices.successOrErrors("err_04");
              var resobj = await common.responseModel.resObj(
                successOrError.code,
                successOrError.message,
                successOrError.parameters.email,
                successOrError.location
              );
              errorArray.push(resobj);
            } else {
              if (emailValidation == false) {
                /**
                 * INVALID EMAIL
                 */
                errorFlag = 1;
                var successOrError =
                await    common.responseServices.successOrErrors("err_03");
                var resobj = await common.responseModel.resObj(
                  successOrError.code,
                  successOrError.message,
                  successOrError.parameters.email,
                  successOrError.location
                );
                errorArray.push(resobj);
              } else {
                adminsObject.email = req.body.email
                  ? req.body.email
                  : adminsDetails.dataValues.email;
              }
            }
          }

          /** Image Update  */
          var files = req.files;
          if (
            files &&
            files.profile != "" &&
            typeof files.profile != "undefined"
          ) {
            var validateProfileImage = await common.helpers.profileValidation(
              files.profile
            );

            if (validateProfileImage == false) {
              var successOrError =
              await     common.responseServices.successOrErrors("err_29");
              var resobj =await   common.responseModel.resObj(
                successOrError.code,
                successOrError.message,
                successOrError.parameters.profile,
                successOrError.location
              );
              return await  common.responseModel.failResponse(
                successOrError.failMsg,
                {},
                resobj
              );
            }
            var bucket = bucketName + "/" + profileImage;

            // Upload Image in AWS bucket
            await common.helpers.uploadFileToS3(
              files.profile,
              validateProfileImage,
              bucket
            );

            //Create update object for profile
            adminsObject.profile = req.files.profile ? validateProfileImage : "";

            var fileExists = await common.query.findOne(
              adminsCollection,
              adminIdQuery
            );
            if (fileExists) {
              if (fileExists.profile != "") {
                await common.helpers.deleteFileFromS3(fileExists.profile, bucket);
              }
            }

          }

          var adminId = { id: decryptId };
          var update = await common.query.update(
            adminsCollection,
            adminId,
            adminsObject
          );

          if (update == 0) {
            /**
             * SOME THING WENT WRONG WHILE UPDATE ADMIN
             */
            errorFlag = 1;
            var successOrError =
            await  common.responseServices.successOrErrors("err_29");
            var resobj = await common.responseModel.resObj(
              successOrError.code,
              successOrError.message,
              successOrError.location
            );
            errorArray.push(resobj);
          }
        } else {
          errorFlag = 1;
          var successOrError =
          await   common.responseServices.successOrErrors("err_57");
          var resobj =  await common.responseModel.resObj(
            successOrError.code,
            successOrError.message,
            successOrError.parameters.adminId,
            successOrError.location
          );
          errorArray.push(resobj);
        }
      } else {
        /**
         * INVALID ADMIN ID
         */
        errorFlag = 1;
        var successOrError = await common.responseServices.successOrErrors("err_57");
        var resobj = await common.responseModel.resObj(
          successOrError.code,
          successOrError.message,
          successOrError.parameters.adminId,
          successOrError.location
        );
        errorArray.push(resobj);
      }
    } else {
      /**
       * INVALID ADMIN ID
       */
      errorFlag = 1;
      var successOrError = await common.responseServices.successOrErrors("err_57");
      var resobj = await common.responseModel.resObj(
        successOrError.code,
        successOrError.message,
        successOrError.parameters.adminId,
        successOrError.location
      );
      errorArray.push(resobj);
    }
    if (errorArray.length > 0 && errorFlag == 1) {
      return await common.responseModel.failResponse("Errors", {}, errorArray);
    } else {
      /**
       * SUCCESS RESPONSE
       */

      var adminsDetails = await common.query.findOne(
        adminsCollection,
        adminIdQuery
      );
      var response = await common.response.admins.adminObjectRes(adminsDetails);
      var successOrError =
      await    common.responseServices.successOrErrors("successMessage");
      return await common.responseModel.successResponse(
        successOrError.adminUpdate,
        response,
        []
      );
    }
  } catch (error) {
    /**
     * CATCH ERROR
     */
    var successOrError =await common.responseServices.successOrErrors("ex_00");
    var resobj =await common.responseModel.resObj(
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
