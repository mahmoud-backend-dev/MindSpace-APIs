/**
 * HELPERES
 */

var common = require("../common");
const http2 = require("http2");

/**
 * DATABASE
 */

const appointments = common.db.appointments;
const usersCollection = common.db.users;

var connect = 0;
async function responseFun() {
	connect = 1;
	return connect;
}

/**
 * CONNECT CALL
 * @param {OBJECT} req
 * @returns OBJECT
 */
module.exports.connect = async (body) => {
	try {
		/**
		 * VIDEO SDK
		 */

		var deviceTypeData = "";
		var fcmTokenData = "";
		var voIpTokenData = "";
		var userName = "";
		var profileImg = "";
		var channelName = "";
		var oppositeUser = "";
		var oppositeUserProfileImg = "";

		/**  appointmentId */

		const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		if (body.appointmentId == "" || typeof body.appointmentId == "undefined") {
			/**
			 * REQUIRED readingRequestId
			 */
			var successOrError = common.responseServices.successOrErrors("err_02");
			var resobj = common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.appointmentId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		} else {
			var decryptedappointmentId = await common.helpers.decryptData(body.appointmentId);
			var appointmentDetails = await common.query.findOne(appointments, {
				where: {
					id: decryptedappointmentId,
				},
			});

			if (appointmentDetails == null) {
				/**
				 * APPOINTMENT  REQUEST NOT FOUND
				 */

				var successOrError = await common.responseServices.successOrErrors("err_66");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.appointmentId,
					successOrError.location
				);

				return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
			} else {
				/** CREATE CHANNEL NAME */
				channelName = appointmentDetails.channelName;
			}
		}

		/** therapistId  */
		if (body.therapistId == "" || typeof body.therapistId == "undefined") {
			/**
			 * REQUIRED readingRequestId
			 */
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.therapistId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		} else {
			var decryptedtherapistId = await common.helpers.decryptData(body.therapistId);

			var therapiestDetails = await common.query.findOne(usersCollection, {
				where: {
					id: decryptedtherapistId,
					isDeleted: 0,
				},
			});

			if (therapiestDetails == null) {
				/**
				 * APPOINTMENT  REQUEST NOT FOUND
				 */

				var successOrError = await common.responseServices.successOrErrors("err_23");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.therapistId,
					successOrError.location
				);

				return await common.responseModel.failResponse(successOrError.failMsg, [], resobj);
			}
		}

		/** patientId  */
		if (body.patientId == "" || typeof body.patientId == "undefined") {
			/**
			 * REQUIRED readingRequestId
			 */
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.patientId,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		} else {
			var decryptedpatientId = await common.helpers.decryptData(body.patientId);

			var patientDetails = await common.query.findOne(usersCollection, {
				where: {
					id: decryptedpatientId,
					isDeleted: 0,
				},
			});

			if (patientDetails == null) {
				/**
				 * APPOINTMENT  REQUEST NOT FOUND
				 */

				var successOrError = await common.responseServices.successOrErrors("err_23");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.patientId,
					successOrError.location
				);

				return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
			}
		}

		/** UUID  */
		if (body.uuid == "" || typeof body.uuid == "undefined") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.uuid,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		}

		/** Send TYPE VIDEO OR AUDIO  */
		if (typeof body.isVideo == "undefined") {
			/**
			 * REQUIRED isVideo
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.isVideo,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		} else {
			if (body.isVideo != true && body.isVideo != false) {
				/**
				 * INVALID VALUE
				 */

				var successOrError = await common.responseServices.successOrErrors("err_137");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.isVideo,
					successOrError.location
				);
				return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
			}
		}

		/** Send By  **/
		if (typeof body.sendBy == "undefined" || body.sendBy == "") {
			/**
			 * REQUIRED sendBy
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.sendBy,
				successOrError.location
			);
			return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
		} else {
			if (body.sendBy == "1") {
				if (therapiestDetails.onlineStatus == "2") {
					var successOrError = await common.responseServices.successOrErrors("err_142");
					return common.responseModel.failResponse(successOrError.message, [], {});
				}
				deviceTypeData = therapiestDetails.deviceType;
				if (therapiestDetails.deviceType == "A") {
					fcmTokenData = therapiestDetails.deviceToken;
				} else {
					voIpTokenData = therapiestDetails.voIpToken;
				}
				userName = patientDetails.firstName + " " + patientDetails.lastName;
				profileImg = patientDetails.profileImage
					? await common.helpers.fetchFileFromS3(
							patientDetails.profileImage,
							process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
					  )
					: "";
				oppositeUser = therapiestDetails.firstName + " " + therapiestDetails.lastName;
				oppositeUserProfileImg = therapiestDetails.profileImage
					? await common.helpers.fetchFileFromS3(
							therapiestDetails.profileImage,
							process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
					  )
					: "";
			} else if (body.sendBy == "0") {
				if (patientDetails.onlineStatus == "2") {
					var successOrError = await common.responseServices.successOrErrors("err_141");
					return common.responseModel.failResponse(successOrError.message, [], {});
				}
				deviceTypeData = patientDetails.deviceType;
				if (patientDetails.deviceType == "A") {
					fcmTokenData = patientDetails.deviceToken;
				} else {
					voIpTokenData = patientDetails.voIpToken;
				}
				userName = therapiestDetails.firstName + " " + therapiestDetails.lastName;
				profileImg = therapiestDetails.profileImage
					? await common.helpers.fetchFileFromS3(
							therapiestDetails.profileImage,
							process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
					  )
					: "";
				oppositeUser = patientDetails.firstName + " " + patientDetails.lastName;
				oppositeUserProfileImg = patientDetails.profileImage
					? await common.helpers.fetchFileFromS3(
							patientDetails.profileImage,
							process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_PROFILE
					  )
					: "";
			} else {
				var successOrError = await common.responseServices.successOrErrors("err_80");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.sendBy,
					successOrError.location
				);
				return common.responseModel.failResponse(successOrError.failMsg, [], resobj);
			}
		}

		var agoraToken = await common.helpers.createAgoraToken(channelName);

		var extraObj = {
			appointmentId: body.appointmentId,
			patientId: body.patientId,
			therapistId: body.therapistId,
			userName: userName,
			profile: profileImg,
			agoraToken: agoraToken,
			channelName: channelName,
			isVideo: body.isVideo,
			sendBy: body.sendBy,
		};

		if (deviceTypeData == "A") {
			/** FOR ANDROID CALL USING FCM TOKEN */
			var bodySend = "";

			var titleSend = `Call from ${userName}`;
			var typeSend = "android_call";
			const fcmToken = fcmTokenData;

			if (appointmentDetails.serviceStatus == "4") {
				var successOrError = await common.responseServices.successOrErrors("err_143");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.connect,
					successOrError.location
				);
				return common.responseModel.failResponse(successOrError.message, {}, {});
			}

			var isSend = await common.notification.sendSingleFirebaseNotification(
				fcmToken,
				bodySend,
				titleSend,
				typeSend,
				extraObj
			);

			var successOrError = await common.responseServices.successOrErrors("successMessage");

			extraObj.userName = oppositeUser;
			extraObj.profile = oppositeUserProfileImg;
			if (isSend == true) {
				await appointments.update(
					{ serviceStatus: "4" },
					{ where: { id: appointmentDetails.id } }
				);
				return await common.responseModel.successResponse("connectSuccess", extraObj, []);
			} else {
				return await common.responseModel.failResponse("connectFailed ", {}, {});
			}
		} else if (deviceTypeData == "I") {
			/** FOR IOS CALL USING VOIP TOKEN */

			/** VO IP TOKEN */

			if (appointmentDetails.serviceStatus == "4") {
				var successOrError = await common.responseServices.successOrErrors("err_143");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.connect,
					successOrError.location
				);
				return common.responseModel.failResponse(successOrError.message, {}, {});
			}

			await connectFunction(voIpTokenData);

			async function connectFunction(deviceTokenVoIP) {
				var host = process.env.callHost;
				var path = "/3/device/" + deviceTokenVoIP;

				const client = http2.connect(host, {
					key: common.fs.readFileSync(__dirname + process.env.KEYPEM),
					cert: common.fs.readFileSync(__dirname + process.env.KEYCRT),
				});

				client.on("error", (err) => {
					return err;
				});

				connectbody = {
					"aps": { "alert": userName + " Call" },
					"id": body.uuid,
					"nameCaller": userName,
					"handle": "0123456789",
					"isVideo": body.isVideo,
					"extra": extraObj,
				};
				headers = {
					":method": "POST",
					"apns-topic": process.env.callVoIP,
					":scheme": "https",
					":path": path,
				};

				const request = client.request(headers);

				request.setEncoding("utf8");
				// var data = ``;
				// request.on('data', (chunk) => { data += chunk; });
				request.write(JSON.stringify(connectbody));
				request.on("end", () => {
					client.close();
				});

				request.on("response", (headers, flags) => {
					for (var name in headers) {
						if (`${headers[name]}` == "200") {
							responseFun();
						}
					}
				});
				request.end();
			}

			/**
			 * SUCCESS RESPONSE
			 */

			await delay(1500);

			if (connect == 1) {
				await appointments.update(
					{ serviceStatus: "4" },
					{ where: { id: appointmentDetails.id } }
				);
				extraObj.userName = oppositeUser;
				extraObj.profile = oppositeUserProfileImg;
				var successOrError = await common.responseServices.successOrErrors("successMessage");
				return await common.responseModel.successResponse("connectSuccess", extraObj, []);
			} else {
				var successOrError = await common.responseServices.successOrErrors("err_140");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.connect,
					successOrError.location
				);
				return common.responseModel.failResponse("Errors", {}, resobj);
			}
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
		return common.responseModel.failResponse(successOrError.failMsg, {}, array);
	}
};
