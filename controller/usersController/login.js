/**
 * NPM PACKAGE
 */
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * HELPERS
 */
var common = require("../common");

/**
 * DATABASE
 */
const usersCollection = common.db.users;

/**
 * USER LOGIN  FUNCTION
 * @param {Object} req
 * @returns Object
 */
module.exports.login = async (req) => {
	try {
		/**
		 * REQUIRE FIELDSs
		 */

		var token = "";

		var loginObj = {};

		if (typeof req.body.loginType == "undefined") {
			/**
			 * INVALID DETAILS
			 */
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.loginType,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.body.loginType == 1 || req.body.loginType == 2 || req.body.loginType == 3) {
			if (typeof req.body.role == "undefined") {
				/**
				 * INVALID DETAILS
				 */
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.role,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			if (req.body.role != 0 && req.body.role != 1) {
				var successOrError = await common.responseServices.successOrErrors("err_74");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.role,
					successOrError.location
				);

				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			loginObj.role = req.body.role;
		}

		if (typeof req.body.deviceType == "undefined" || req.body.deviceType == "") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.deviceType,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (req.body.deviceType != "A" && req.body.deviceType != "I") {
			/**
			 * INVALID DEVICE TYPE
			 */
			var successOrError = await common.responseServices.successOrErrors("err_35");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.deviceType,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (req.body.deviceType == "I") {
			if (typeof req.body.voIpToken == "undefined" || req.body.voIpToken == "") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.voIpToken,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
		}
		if (typeof req.body.deviceToken == "undefined" || req.body.deviceToken == "") {
			/**
			 * REQUIRED  DEVICE TOKEN
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.deviceToken,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		if (typeof req.body.deviceId == "undefined" || req.body.deviceId == "") {
			/**
			 * REQUIRED  DEVICE TOKEN
			 */

			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.deviceId,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (typeof req.body.timezone == "undefined" || req.body.timezone == "") {
			var successOrError = await common.responseServices.successOrErrors("err_02");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.timezone,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		/** Check Given Time zone is valid or not */
		const validateTimeZone = common.helpers.isValidTimezone(req.body.timezone);

		if (validateTimeZone == false) {
			/**
			 * INVALID TIME ZONE
			 */

			var successOrError = await common.responseServices.successOrErrors("err_145");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.timezone,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		loginObj.deviceToken = req.body.deviceToken;
		loginObj.deviceType = req.body.deviceType;
		loginObj.deviceId = req.body.deviceId;
		loginObj.voIpToken = req.body.voIpToken;
		loginObj.loginType = req.body.loginType;
		loginObj.timezone = req.body.timezone;

		var device = await usersCollection.findOne({
			where: { deviceId: req.body.deviceId },
		});
		var deviceUpdateObj = {
			deviceId: "",
			deviceToken: "",
			voIpToken: "",
		};

		if (req.body.loginType == 0) {
			/**
			 * REQUIRED FIELD : EMAIL
			 */

			if (req.body.email == "" || typeof req.body.email == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			var validateEmail = await common.helpers.validateEmail(req.body.email);

			if (validateEmail == false) {
				var successOrError = await common.responseServices.successOrErrors("err_03");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			/**
			 * REQUIRED FIELD : PASSWORD
			 */
			if (req.body.password == "" || typeof req.body.password == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.password,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			var usersDetails = await common.query.findOne(usersCollection, {
				where: { email: req.body.email, isDeleted: 0 },
			});

			if (!usersDetails) {
				/**
				 * EMAIL ID NOT FOUND
				 */
				var successOrError = await common.responseServices.successOrErrors("err_77");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.email,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			if (usersDetails.deviceId != req.body.deviceId) {
				if (usersDetails.deviceToken != "") {
					token = usersDetails.deviceToken;
				}
				await usersCollection.update(deviceUpdateObj, {
					where: { id: usersDetails.id },
				});
			}
			if (device) {
				if (device.id != usersDetails.id) {
					token = device.deviceToken;
					await usersCollection.update(deviceUpdateObj, {
						where: { id: device.id },
					});
				}
			}

			var comparePassword = await bcrypt.compare(req.body.password, usersDetails.password);

			if (comparePassword == false) {
				/**
				 * PASSWORD IS WRONG
				 */
				var successOrError = await common.responseServices.successOrErrors("err_49");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.password,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			await usersCollection.update(loginObj, {
				where: { id: usersDetails.id },
			});

			var userId = usersDetails.id;
			if (usersDetails.isSuspend == 1) {
				/**
				 * SUSPENDED USER
				 */
				await usersCollection.update(deviceUpdateObj, { where: { id: usersDetails.id } });
				var successOrError = await common.responseServices.successOrErrors("err_97");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.isSuspend,
					successOrError.location
				);
				var encryptId = await common.helpers.encryptData(usersDetails.id);
				var usrObj = {
					id: encryptId,
					reason: usersDetails.suspendReason,
					subject: usersDetails.suspendSubject,
				};
				return await common.responseModel.failResponse(successOrError.failMsg, usrObj, resobj);
			} else if (usersDetails.isActive == "0" && usersDetails.role == 0) {
				/**
				 * PENDING USER
				 */

				var successOrError = await common.responseServices.successOrErrors("err_52");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.noParams,
					successOrError.location
				);

				var encryptId = await common.helpers.encryptData(usersDetails.id);
				var userObj = {
					id: encryptId,
				};

				return await common.responseModel.failResponse(successOrError.failMsg, userObj, resobj);
			} else if (usersDetails.isActive == "2" && usersDetails.role == 0) {
				/**
				 * INCOMPLETE USER DEATAILS
				 */
				var successOrError = await common.responseServices.successOrErrors("err_73");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.noParams,
					successOrError.location
				);

				var userObj = await common.response.users.singleUserObjectRes(usersDetails.id);
				return await common.responseModel.failResponse(successOrError.failMsg, userObj, resobj);
			} else if (usersDetails.isActive == "3" && usersDetails.role == 0) {
				var successOrError = await common.responseServices.successOrErrors("err_60");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.noParams,
					successOrError.location
				);

				var encryptId = await common.helpers.encryptData(usersDetails.id);

				var userObj = {
					id: encryptId,
					reason: usersDetails.reason,
				};
				return await common.responseModel.failResponse(successOrError.failMsg, userObj, resobj);
			} else if (usersDetails.isActive == "0") {
				/**
				 * DEACTIVATED USER
				 */

				var successOrError = await common.responseServices.successOrErrors("err_45");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.deactivate,
					successOrError.location
				);
				var encryptId = await common.helpers.encryptData(usersDetails.id);
				var usrObj = {
					id: encryptId,
				};
				return await common.responseModel.failResponse(successOrError.failMsg, usrObj, resobj);
			}
		} else if (req.body.loginType == 1) {
			/**
			 * REQUIRED FIELD : GOOGLE ID
			 */
			var query = {};
			if (req.body.googleId == "" || typeof req.body.googleId == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.googleId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			query.where = {
				googleId: req.body.googleId,
				isDeleted: 0,
			};

			loginObj.googleId = req.body.googleId;
		} else if (req.body.loginType == 2) {
			/**
			 * REQUIRED FIELD : APPLE ID
			 */

			var query = {};
			if (req.body.appleId == "" || typeof req.body.appleId == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.appleId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}
			query.where = {
				appleId: req.body.appleId,
				isDeleted: 0,
			};

			loginObj.appleId = req.body.appleId;
		} else if (req.body.loginType == 3) {
			/**
			 * REQUIRED FIELD : FACEBOOK ID
			 */

			var query = {};
			if (req.body.facebookId == "" || typeof req.body.facebookId == "undefined") {
				var successOrError = await common.responseServices.successOrErrors("err_02");
				var resobj = await common.responseModel.resObj(
					successOrError.code,
					successOrError.message,
					successOrError.parameters.facebookId,
					successOrError.location
				);
				return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
			}

			query.where = {
				facebookId: req.body.facebookId,
				isDeleted: 0,
			};
			loginObj.facebookId = req.body.facebookId;
		} else {
			/**
			 * Invalid login type, only avaliable 0:email,1:googleId and 2:appleId 3:facebookId
			 */
			var successOrError = await common.responseServices.successOrErrors("err_38");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.parameters.loginType,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}

		if (query) {
			var userExists = await common.query.findOne(usersCollection, query);

			if (userExists) {
				if (userExists.deviceId != req.body.deviceId) {
					if (userExists.deviceToken != "") {
						token = userExists.deviceToken;
					}
					await usersCollection.update(deviceUpdateObj, {
						where: { id: userExists.id },
					});
				}
				if (device) {
					if (device.id != userExists.id) {
						token = device.deviceToken;
						await usersCollection.update(deviceUpdateObj, {
							where: { id: device.id },
						});
					}
				}

				if (userExists.role != req.body.role) {
					if (req.body.role == 0) {
						var role = "patient";
					} else if (req.body.role == 1) {
						var role = "therapist";
					}
					var successOrError = await common.responseServices.successOrErrors("err_51");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message + role,
						successOrError.parameters.role,
						successOrError.location
					);

					return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
				} else if (userExists.isSuspend == 1) {
					/**
					 * SUSPENDED USER
					 */

					var successOrError = await common.responseServices.successOrErrors("err_97");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.isSuspend,
						successOrError.location
					);
					var encryptId = await common.helpers.encryptData(userExists.id);
					var usrObj = {
						id: encryptId,
						reason: userExists.suspendReason,
						subject: userExists.suspendSubject,
					};
					return await common.responseModel.failResponse(
						successOrError.failMsg,
						usrObj,
						resobj
					);
				} else if (userExists.isActive == "0" && userExists.role == 0) {
					/*
					DEACTIVATED USERS
					*/
					var successOrError = await common.responseServices.successOrErrors("err_52");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.noParams,
						successOrError.location
					);

					var encryptId = await common.helpers.encryptData(userExists.id);
					var usrObj = {
						id: encryptId,
					};
					return await common.responseModel.failResponse(
						successOrError.failMsg,
						usrObj,
						resobj
					);
				} else if (userExists.isActive == "2" && userExists.role == 0) {
					var successOrError = await common.responseServices.successOrErrors("err_73");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.noParams,
						successOrError.location
					);

					var userObj = await common.response.users.singleUserObjectRes(userExists.id);
					return await common.responseModel.failResponse(
						successOrError.failMsg,
						userObj,
						resobj
					);
				} else if (userExists.isActive == "3" && userExists.role == 0) {
					var successOrError = await common.responseServices.successOrErrors("err_60");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.noParams,
						successOrError.location
					);

					var encryptId = await common.helpers.encryptData(userExists.id);
					var usrObj = {
						id: encryptId,
						reason: userExists.reason,
					};
					return await common.responseModel.failResponse(
						successOrError.failMsg,
						usrObj,
						resobj
					);
				} else if (userExists.isActive == "0") {
					var successOrError = await common.responseServices.successOrErrors("err_45");
					var resobj = await common.responseModel.resObj(
						successOrError.code,
						successOrError.message,
						successOrError.parameters.deactivate,
						successOrError.location
					);
					var encryptId = await common.helpers.encryptData(userExists.id);
					var usrObj = {
						id: encryptId,
					};
					return await common.responseModel.failResponse(
						successOrError.failMsg,
						usrObj,
						resobj
					);
				}

				await usersCollection.update(loginObj, {
					where: { id: userExists.id },
				});

				var userId = userExists.id;
			} else {
				if (typeof req.body.email != "undefined" && req.body.email != "") {
					var emailExists = await usersCollection.findOne({
						where: { email: req.body.email, isDeleted: 0 },
					});

					if (emailExists) {
						var successOrError = await common.responseServices.successOrErrors("err_04");
						var resobj = await common.responseModel.resObj(
							successOrError.code,
							successOrError.message,
							successOrError.parameters.email,
							successOrError.location
						);

						return await common.responseModel.failResponse(
							successOrError.failMsg,
							{},
							resobj
						);
					}
				}

				loginObj.email = req.body.email ? req.body.email : "";
				loginObj.isActive = req.body.role == 0 ? "0" : "1";
				var userLogin = await usersCollection.create(loginObj);

				var userId = userLogin.id;
			}
		}

		var userData = await usersCollection.findOne({ where: { id: userId } });

		var jwtToken = jwt.sign(
			{ userId: userId, deviceId: userData.deviceId },
			process.env.SECRET_KEY
		);

		var response = await common.response.users.singleUserObjectRes(userId, jwtToken);

		/**
		 * ERROR RESPONSE
		 */
		if (!response) {
			var successOrError = await common.responseServices.successOrErrors("err_30");
			var resobj = await common.responseModel.resObj(
				successOrError.code,
				successOrError.message,
				successOrError.location
			);
			return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
		}
		/**
		 * SUCCESS
		 */
		if (token != "") {
			let key = "autoLogout";
			isSend = await common.notification.sendSingleFirebaseNotification(token, "", "", key);
		}

		var successOrError = await common.responseServices.successOrErrors("successMessage");
		return await common.responseModel.successResponse(successOrError.login, response, {});
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
		return await common.responseModel.failResponse(successOrError.failMsg, {}, resobj);
	}
};
