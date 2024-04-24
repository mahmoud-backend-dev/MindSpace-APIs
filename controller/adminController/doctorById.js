/**
 * HELPERS
 */
const {
  certificateObject,
  educationalCertiObjRes,
} = require("../../response/usersObject");
var common = require("../common");

/**
 * DATABASE
 */

const users = common.db.users;
const userTherapies = common.db.userTherapies;
const therapies = common.db.therapies;
const professional = common.db.professional;
const certifications = common.db.certifications;
const therapistWorkDays = common.db.therapistWorkDays;
const reviewsCollections = common.db.reviews;
const bankDetailsCollection = common.db.bankDetails;
const appointments = common.db.appointments;
const paymentCollection = common.db.payment;

/**
 * GET DOCTOR DETAILS BY ID
 * @param {Object} req
 * @returns Object
 */
module.exports.doctorById = async (req) => {
  try {
    var errorArray = [];
    var errorFlag = 0;
    if (req.params.id != "" && typeof req.params.id != "undefined") {
      var decryptId = await common.helpers.decryptData(req.params.id);
      if (decryptId != false) {
        var doctorsDetails = await common.query.find(users, {
          where: { id: decryptId, isDeleted: 0 },
          include: [
            {
              model: userTherapies,
              as: "userTherapies",
              attributes: ["therapiId"],
              include: [
                {
                  model: therapies,
                  as: "therapies",
                  attributes: ["therapiName"],
                },
              ],
            },
            {
              model: professional,
              as: "professionalDetails",
            },
            {
              model: certifications,
              as: "certifications",
            },
            {
              model: therapistWorkDays,
              as: "therapistWorkDays",
              attributes: [
                "id",
                "dayOfWeek",
                "morningStartTime",
                "morningEndTime",
                "isMorningAvailable",
                "afternoonStartTime",
                "afternoonEndTime",
                "isAfternoonAvailable",
                "eveningStartTime",
                "eveningEndTime",
                "isEveningAvailable",
              ],
            },
            {
              model: reviewsCollections,
              as: "therapistReviews",
              include: [
                {
                  model: users,
                  as: "patientReviews",
                },
              ],
            },
            {
              model: bankDetailsCollection,
              as: "bankDetails",
            },
          ],
        });

        if (doctorsDetails == null) {
          /**
           * USER NOT FOUND
           */
          errorFlag = 1;
          var successOrError = await common.responseServices.successOrErrors(
            "err_17"
          );
          var resobj = await common.responseModel.resObj(
            successOrError.code,
            successOrError.message,
            successOrError.parameters.userId,
            successOrError.location
          );
          errorArray.push(resobj);
        }
      } else {
        /**
         * INVALID USER ID
         */
        errorFlag = 1;
        var successOrError = await common.responseServices.successOrErrors(
          "err_57"
        );

        var resobj = await common.responseModel.resObj(
          successOrError.code,
          successOrError.message,
          successOrError.parameters.userId,
          successOrError.location
        );
        errorArray.push(resobj);
      }
    } else {
      /**
       * INVALID USER ID
       */
      errorFlag = 1;
      var successOrError = await common.responseServices.successOrErrors(
        "err_17"
      );
      var resobj = await common.responseModel.resObj(
        successOrError.code,
        successOrError.message,
        successOrError.parameters.userId,
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

      /** Single Doctor details Object */
      var dataArray = {};

      /** Get Complete Appointments  */
      var getAppointmentDetails = await appointments.findAll({
        attributes: ["id"],
        where: {
          therapistId: decryptId,
          status: "1",
          "$payment.paymentStatus$": "1",
        },
        include: [
          {
            model: paymentCollection,
            as: "payment",
          },
        ],
        group: ["id"],
      });

      const patientEarning = {
        count: 0,
        totalEarning: 0,
      };

      for (let index = 0; index < getAppointmentDetails.length; index++) {
        const element = getAppointmentDetails[index];

        patientEarning.count++;
        patientEarning.totalEarning += +element.payment?.amount;
      }

      for (let i = 0; i < doctorsDetails.length; i++) {
        let doctorsDetailsList = doctorsDetails[i];
        let inner = doctorsDetailsList.userTherapies;
        let innerExperience = doctorsDetailsList.professionalDetails;
        let certificationsDetails = doctorsDetailsList.certifications;
        let workDaysDetails = doctorsDetailsList.therapistWorkDays;
        let therapistReviews = doctorsDetailsList.therapistReviews;
        let bankDetailsList = doctorsDetailsList.bankDetails;

        const therapiArr = [];
        const certificates = [];
        const workingTimeTable = [];
        const reviews = [];
        const bankDetails = [];

        let professionalCount = 0;
        for (let j = 0; j < inner.length; j++) {
          const element1 = inner[j].therapies?.therapiName;
          therapiArr.push(element1);
        }
        for (let k = 0; k < innerExperience.length; k++) {
          const element2 = innerExperience[k].workExperience;
          professionalCount += parseInt(element2);
        }

        for (let l = 0; l < certificationsDetails.length; l++) {
          const element = certificationsDetails[l];
          if (element.documentType == "government") {
            const governmentData = await certificateObject(element);
            certificates.push(governmentData.document);
          } else {
            const educationData = await educationalCertiObjRes(element);
            certificates.push(educationData.document);
          }
        }

        for (let m = 0; m < workDaysDetails.length; m++) {
          const workingDayElement = workDaysDetails[m];
          workingTimeTable.push(workingDayElement);
        }
        var ratingCount = 0;
        for (let n = 0; n < therapistReviews.length; n++) {
          const element = therapistReviews[n];
          if (
            element.patientReviews != null &&
            typeof element.patientReviews != undefined &&
            typeof element.profileImage != undefined
          ) {
            var profileImage = await common.helpers.fetchFileFromS3(
              element.patientReviews.profileImage,
              process.env.AWS_BUCKETNAME +
                "/" +
                process.env.AWS_UPLOAD_PATH_FOR_PROFILE
            );
          } else {
            var profileImage = "";
          }
          ratingCount = ratingCount + parseInt(element.rating);
          var resObj = {
            patientName:
              element.patientReviews?.firstName +
              " " +
              element.patientReviews?.firstName,
            profileImage: profileImage,
            rating: element.rating,
            description: element.description,
          };
          reviews.push(resObj);
        }

        for (let o = 0; o < bankDetailsList.length; o++) {
          const bankList = bankDetailsList[o];
          bankDetails.push(bankList);
        }

        var response = await common.response.admins.singleDoctorsObjectRes(
          doctorsDetailsList,
          therapiArr,
          professionalCount,
          certificates,
          workingTimeTable,
          reviews,
          ratingCount,
          bankDetails,
          patientEarning
        );
        dataArray = response;
      }

      var successOrError = await common.responseServices.successOrErrors(
        "successMessage"
      );

      return await common.responseModel.successResponse(
        successOrError.getDoctors,
        dataArray,
        {}
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
    return await common.responseModel.failResponse(
      successOrError.failMsg,
      {},
      array
    );
  }
};
