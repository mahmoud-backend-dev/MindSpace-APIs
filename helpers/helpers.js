require("dotenv").config();
const path = require("path");
const AWS = require("aws-sdk");
const constant = require("../config/constant");
var moment = require("moment");
const momentTz = require("moment-timezone");
var fs = require("fs");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

AWS.config.update({
	accessKeyId: process.env.AWSS3_ACCESSKEY_ID,
	secretAccessKey: process.env.AWSS3_SECRET_ACCESSKEY,
	region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
/**
 *
 * DOCUMENT AWS UPLOAD FUNCTION
 */

async function uploadFileToS3(fileName, key, bucket) {
	try {
		var extention = key.split(".");

		if (extention[1] == "png" || extention[1] == "jpeg" || extention[1] == "jpg") {
			var ContentType = "image/" + extention[1];
		} else if (extention[1] == "pdf") {
			var ContentType = "application/" + extention[1];
		} else {
			var ContentType = fileName.mimetype;
		}
		const params = {
			Bucket: bucket,
			Key: key,
			Body: fileName.data,
			ContentType: ContentType,
		};

		var uploadFile = s3.upload(params, function (err, data) {
			if (err) {
				throw err;
			}
		});
		return uploadFile;
	} catch (error) {
		return false;
	}
}

/**
 *
 * FETCH FROM S3 BUCKET
 */
const getSignedUrl = async (bucket, key) => {
	var url = await s3.getSignedUrlPromise("getObject", {
		Bucket: bucket,
		Key: key,
		Expires: 60 * 60 * 24 * 7, // 90 days
	});
	return url;
};

const signURL = async (url) => {
	if (url) {
		const newURL = await getSignedUrl(process.env.AWS_BUCKETNAME, url);
		return newURL;
	} else {
		return url;
	}
};

/**
 *
 * FETCH FROM S3 BUCKET
 */

async function fetchFileFromS3(key, bucket) {
	try {
		const url = await s3.getSignedUrlPromise("getObject", {
			Bucket: bucket,
			Key: key,
			// Expires: 6000,
			Expires: 6000,
		});
		return url;
	} catch (error) {
		return false;
	}
}

async function deleteFileFromS3(key, bucket) {
	try {
		var params = {
			Bucket: bucket,
			Key: key,
		};

		s3.deleteObject(params, function (err, data) {
			if (err) return err;
		});
	} catch (error) {
		return false;
	}
}
/**
 *
 * IMAGE UPLOAD FUNCTION
 */
async function img(profile, profilePath) {
	try {
		let sampleFile;
		let uploadPath;
		sampleFile = profile;
		const extensionArray = [".jpg", ".png", ".jpeg", ".heif"];
		var extensionCheck = extensionArray.includes(path.extname(sampleFile.name));
		if (extensionCheck) {
			var img = (await randomString(10)) + Date.now() + path.extname(sampleFile.name);
			uploadPath = profilePath + img;
			sampleFile.mv(uploadPath, function (err) {
				if (err) throw err;
			});

			return img;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

/**
 *
 * DOCUMENT UPLOAD FUNCTION
 */
async function fileValidation(fileName) {
	try {
		let sampleFile;
		sampleFile = fileName;
		const extensionArray = [".jpg", ".jpeg", ".pdf", ".png"];
		var extensionCheck = extensionArray.includes(path.extname(sampleFile.name));
		if (extensionCheck) {
			var img = (await randomString(10)) + Date.now() + path.extname(sampleFile.name);
			// uploadPath = profilePath + img;
			// sampleFile.mv(uploadPath, function (err) {
			// 	if (err) throw err;
			// });

			return img;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

/**
 *
 * DOCUMENT UPLOAD FUNCTION
 */
async function pdfValidation(fileName) {
	try {
		let sampleFile;
		sampleFile = fileName;
		const extension = ".pdf";
		var extensionCheck = extension.includes(path.extname(sampleFile.name));
		if (extensionCheck) {
			var img = (await randomString(10)) + Date.now() + path.extname(sampleFile.name);
			return img;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

/**
 *
 * DOCUMENT UPLOAD FUNCTION
 */
async function profileValidation(profile, profilePath) {
	try {
		let sampleFile;

		sampleFile = profile;
		const extension = [".jpg", ".jpeg", ".png"];
		var extensionCheck = extension.includes(path.extname(sampleFile.name));
		if (extensionCheck) {
			var img = (await randomString(10)) + Date.now() + path.extname(sampleFile.name);

			return img;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

/**
 *
 * IMAGE / VIDEO UPLOAD FUNCTION
 */
async function post(video, videoPath) {
	try {
		let sampleFile;
		let uploadPath;
		sampleFile = video;
		const extensionArray = [
			".jpg",
			".png",
			".jpeg",
			".heif",
			".mp4",
			".mkv",
			".mov",
			".hevc",
			"webm",
		];
		var extensionCheck = extensionArray.includes(path.extname(sampleFile.name));
		if (extensionCheck) {
			var img = (await randomString(10)) + Date.now() + path.extname(sampleFile.name);
			uploadPath = videoPath + img;
			sampleFile.mv(uploadPath, function (err) {
				if (err) throw err;
			});
			return img;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

/**
 *
 * MEDIA UPLOAD FUNCTION
 */
async function mediaPdf(media, mediaPath) {
	try {
		let sampleFile;
		let uploadPath;
		sampleFile = media;
		var ext = ".pdf";
		var extensionCheck = ext.includes(path.extname(sampleFile.name));
		if (extensionCheck) {
			var fileName = (await randomString(10)) + Date.now() + path.extname(sampleFile.name);

			uploadPath = mediaPath + fileName;

			fileName.mv(uploadPath, function (err) {
				if (err) throw err;
			});
			return fileName;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

/**
 *
 * CHECK STRONG PASSWORD VALIDATION FUNCTION
 * @param {STRING} inputtxt
 * @returns BOOLEAN
 */
async function checkPassword(inputtxt) {
	var passw = constant.kPasswordRegex;
	if (inputtxt.match(passw)) {
		return true;
	} else {
		return false;
	}
}

/**
 *
 * PHONE NUBER VALIDATION FUNCTION
 * @param {number} phone
 * @returns BOOLEAN
 */
async function checkPhone(phone) {
	var phoneNo = constant.kPhoneRegex;
	if (phoneNo.test(phone)) {
		return true;
	} else {
		return false;
	}
}

/**
 *
 * CHECK EMAIL VALIDATION FUCNTION
 * @param {STRING} email
 * @returns BOOLEAN
 */
async function validateEmail(email) {
	var re = constant.kEmailRegex;
	return re.test(email);
}

/**
 *
 * Date validation function
 * @param {String} str
 * @returns Boolean
 */
async function parseDate(str) {
	var m = str.match(constant.kDateRegex);
	return m ? true : false;
}

/**
 *
 * COUNTRY CODE VALIDATION FUNCTION
 */
async function countryCodeValidation(country) {
	var codeRegex = constant.kCountryCodeRegex;
	if (codeRegex.test(country)) {
		return true;
	} else {
		return false;
	}
}

/**
 *
 * FIRST NAME VALIDATION FUNCTION
 */
async function nameValidation(fsName) {
	var ValidationFsName = fsName.match(constant.kFirstNameRegex);
	return ValidationFsName ? true : false;
}

/**
 * USER NAME VALIDATION FUNCTION
 * @param {String} username
 * @returns
 */
async function usernameValidation(username) {
	var ValidationUsername = username.match(constant.kUsername);
	return ValidationUsername ? true : false;
}

/**
 *
 * GET AGE FUNCTION
 * @param {STRING} dateString
 * @returns NUMBER
 */
async function getAge(dateString) {
	return new Promise((resolve) => {
		var Birthday = moment(dateString, "yyyy-mm-dd");
		var DOB = Birthday.format("yyyy-mm-dd");

		var split = DOB.split("-");

		var year = parseInt(split[0]);
		var month = parseInt(split[2]);
		var day = parseInt(split[1]);
		var today = new Date();
		var age = today.getFullYear() - year;
		if (
			today.getMonth() + 1 < month ||
			(today.getMonth() + 1 == month && today.getDate() < day && age != 18)
		) {
			age--;
		}

		return resolve(age);
	});
}

/**
 *
 * LATITUDE LONGITUDE VALIDATION FUNCTION
 * @param {STRING} latlong
 * @returns BOOLEAN
 */
async function latLong(latlong) {
	var kLatLongitude = latlong.match(constant.kLatLongitude);
	return kLatLongitude ? true : false;
}

/**
 *
 * REMOVE IMAGE (USER)
 * @param {STRING} image
 */
async function destroyImg(image, destroyPath) {
	var imageFullPathName = path.join(destroyPath, image);
	var dlt = true;
	fs.unlink(imageFullPathName, function (err) {
		if (err) {
			if (err.code != "ENOENT") {
				dlt = false;
			}
		}
	});
	return dlt;
}

/**
 *
 * GENERATE RANDOM STRING
 * @param {STRING} length
 * @returns STRING
 */
async function randomString(length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

/**
 *
 * ENCRYPT DATA FUNCTION
 * @param {STRING} id
 * @returns STRING
 */
const encryptData = async (id) => {
	return new Promise((resolve) => {
		var dataId = CryptoJS.AES.encrypt(JSON.stringify(id), process.env.SECRET_KEY).toString();
		var dataString = dataId
			.replace(/\+/g, "p1L2u3S")
			.replace(/\//g, "s1L2a3S4h")
			.replace(/=/g, "e1Q2u3A4l");
		return resolve(dataString);
	});
};

/**
 *
 * ENCRYPT DATA FUNCTION
 * @param {STRING} id
 * @returns STRING
 */
const encryptPass = async (pass) => {
	return new Promise((resolve) => {
		var dataPass = CryptoJS.AES.encrypt(pass, process.env.SECRET_KEY).toString();
		var dataString = dataPass
			.replace(/\+/g, "p1L2u3S")
			.replace(/\//g, "s1L2a3S4h")
			.replace(/=/g, "e1Q2u3A4l");
		return resolve(dataString);
	});
};

/**
 *
 * DECRYPT DATA FUNCTION
 * @param {STRING} id
 * @returns STRING
 */
const decryptData = async (id) => {
	return new Promise((resolve) => {
		try {
			var ciphertext = id
				.replace(/p1L2u3S/g, "+")
				.replace(/s1L2a3S4h/g, "/")
				.replace(/e1Q2u3A4l/g, "=");
			var data = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY).toString(
				CryptoJS.enc.Utf8
			);

			if (data.indexOf('"') > -1) {
				dataId = data.substring(1, data.length - 1);
			} else {
				dataId = data;
			}

			return resolve(dataId);
		} catch (e) {
			return resolve("");
		}
	});
};

/**
 * CHECK ALPHBET EXISTANCE
 * @param {STRING} inputtxt
 * @returns BOOLEAN
 */
async function checkAlphabetExistance(inputtxt) {
	var passw = constant.kAlphabet;
	if (inputtxt.match(passw)) {
		return true;
	} else {
		return false;
	}
}

/**
 * SEND MAIL
 * @param {String} email
 * @param {String} htmlContent
 * @param {String} subject
 * @returns
 */
async function sendMail(htmlContent, subject, email) {
	try {
		var transporter = nodemailer.createTransport({
			transport: `${process.env.MAIL_TRANSPORT}`,
			host: `${process.env.MAIL_HOST}`,
			port: `${process.env.EMAIL_HOST}`,
			debug: true,
			auth: {
				user: `${process.env.MAIL_AUTH_USER}`,
				pass: `${process.env.MAIL_AUTH_PASSWORD}`,
			},
			secure: false,
			tls: { rejectUnauthorized: false },
			debug: true,
		});
		var mailOptions = {
			from: `'${process.env.PROJECT_NAME}' <${process.env.MAIL_AUTH_USER}>`,
			to: email,
			subject: subject,
			html: htmlContent,
		};

		var mail = await transporter.sendMail(mailOptions);

		if (mail) {
			return mail;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

const createToken = async (token) => {
	try {
		let random = "";
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		const charactersLength = characters.length;
		for (let i = 0; i < 20; i++) {
			random += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		var data = JSON.stringify({
			operation: "create",
			notification_key_name: random,
			registration_ids: token,
		});

		var config = {
			method: "post",
			url: "https://fcm.googleapis.com/fcm/notification",
			headers: {
				project_id: process.env.NOTIFICATION_TOKEN_PROJECT_ID,
				Authorization: "key=" + process.env.NOTIFICATION_TOKEN_AUTHORIZATION,
				"Content-Type": "application/json",
			},
			data: data,
		};

		try {
			const response = await axios(config);
			return response.data.notification_key;
		} catch (err) {
			return err;
		}
	} catch (e) {
		console.log(e);
	}
};

/**
 * SEND NOTIFICATION
 * @param {Object} data
 */
async function sendNotification(data, db_token) {
	try {
		const authorization = await createAuth();

		const token = await createToken(db_token);
		//
		if (authorization != false && db_token != false) {
			const header = {
				Authorization: `Bearer ` + authorization,
				"Content-Type": "application/json",
			};

			const requestData = {
				message: {
					token: token,
					notification: {
						title: data.notification.title,
						body: data.notification.body,
					},
					data: "",
					apns: {
						payload: {
							aps: {
								sound: "default",
							},
						},
					},
				},
			};
			const result = await axios.post(process.env.FCM_SEND_URL, JSON.stringify(requestData), {
				headers: header,
			});
		}
	} catch (e) {
		console.log(e);
	}
}

/**
 * CREATE AGORA TOKEN
 * @param {String} channelName
 * @returns
 */
async function createAgoraToken(channelName) {
	return new Promise(async (resolve) => {
		try {
			const appID = "a8faa6b9c4e6455889588c3895a68bac";
			const appCertificate = "37627838ac3d49469c9014d8a9acff32";
			// const appID = process.env.appID;
			// const appCertificate = process.env.appCertificate;
			const role = RtcRole.PUBLISHER;
			const expirationTimeInSeconds = 3600;
			const currentTimestamp = Math.floor(Date.now() / 1000);
			const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

			token = RtcTokenBuilder.buildTokenWithAccount(
				appID,
				appCertificate,
				channelName,
				0,
				role,
				privilegeExpiredTs
			);

			resolve(token);
		} catch (e) {
			resolve(false);
		}
	});
}

/**
 * VALIDATE DATE FUNCTION
 * @param {String} date
 * @returns
 */

async function validatedate(date) {
	var birthdate = constant.kDateRegex;
	if (date.match(birthdate)) {
		return true;
	} else {
		return false;
	}
}
/**
 * VALIDATE DATE FUNCTION YYYY-MM-DD
 * @param {String} date
 * @returns
 */

async function validateLeaveDate(date) {
	var leaveDate = constant.kLeaveDateRegex;

	if (date.match(leaveDate)) {
		return true;
	} else {
		return false;
	}
}
/**
 * VALIDATE ACCOUNT NAME FUNCTION
 * @param {String} accountName
 * @returns
 */

async function validatName(accountName) {
	var accountnameReg = constant.kAccountNameRegex;
	if (accountName.match(accountnameReg)) {
		return true;
	} else {
		return false;
	}
}
async function booleanCheck(boolean) {
	if (typeof boolean === "boolean") {
		return true;
	} else {
		return false;
	}
}

/**
 * VALIDATE ACCOUNT NUMBER FUNCTION
 * @param {String} accountName
 * @returns
 */
async function validateAccountNumber(accountNumber) {
	var accountNumberReg = constant.kAccountNumberRegex;
	if (accountNumberReg.test(accountNumber)) {
		return true;
	} else {
		return false;
	}
}
/**
 * VALIDATE IBAN NUMBER FUNCTION
 * @param {String} accountName
 * @returns
 */
async function validateIBANNumber(ibanNumber) {
	var ibanNumberReg = constant.kIbanNoRegex;
	if (ibanNumberReg.test(ibanNumber)) {
		return true;
	} else {
		return false;
	}
}

/**  Create Slots based on start and end time */
async function getTimeSlots(utcStart, utcEnd, interval) {
	const startTimeRR = moment(utcStart, "HH:mm").format();
	const endTimeRR = moment(utcEnd, "HH:mm").format();
	var startTime = moment(startTimeRR);
	var endTime = moment(endTimeRR);
	if (endTime.isBefore(startTime)) {
		endTime.add(1, "day");
	}
	var timeSlots = [];
	while (startTime.format() < endTime.format()) {
		const milliseconds = moment(new Date(moment(endTime).format("YYYY-MM-DDTHH:mm:ss"))).diff(
			new Date(moment(startTime).format("YYYY-MM-DDTHH:mm:ss"))
		);
		if (milliseconds / 60000 >= interval) {
			timeSlots.push(new moment(startTime).format("HH:mm"));
		}
		startTime.add(interval, "minutes");
	}
	return timeSlots;
}

async function getDateTimeSlots(utcStart, utcEnd, interval) {
	const startTime = moment(utcStart);
	const endTime = moment(utcEnd);
	if (endTime.isBefore(startTime)) {
		endTime.add(1, "day");
	}
	var timeSlots = [];
	while (startTime < endTime) {
		timeSlots.push(new moment(startTime).utc().format());
		startTime.add(interval, "minutes");
	}
	return timeSlots;
}

/** BASE64 to file path */

const base64ToBufferAWS = async (base64Data, bucket) => {
	try {
		if (base64Data) {
			const mimeTypeMatch = base64Data.match(/^data:(.+?);base64,/);
			const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : null;
			const extension = mimeType ? "." + mimeType.split("/")[1] : null;

			const bufferData = Buffer.from(base64Data.split(",")[1], "base64");

			var img = (await randomString(5)) + Date.now() + extension;

			const params = {
				Bucket: bucket,
				Key: img,
				Body: bufferData,
				ContentType: mimeType,
			};

			s3.upload(params, function (err, data) {
				if (err) {
					throw err;
				}
			});
			return img;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

async function randomStringPayment(length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

async function createInvoice(invoice) {
	// var fileName = (await randomString(10)) + Date.now() + ".pdf";
	// var filePath = "public/upload/invoice" + "/" + fileName;
	var fileName = await invoiceFunction(invoice);
	return fileName;
}

async function invoiceFunction(invoice) {
	var fileName = (await randomString(10)) + Date.now() + ".pdf";
	let doc = new PDFDocument({ size: "A4", margin: 50 });

	await generateHeader(doc, invoice);
	await generateCustomerInformation(doc, invoice);
	await generateInvoiceTable(doc, invoice);
	// generateFooter(doc);

	//var dd = doc.end();

	//doc.pipe(fs.createWriteStream(path));

	const buffers = [];
	var buffer = "";
	doc.on("data", (chunk) => buffers.push(chunk));
	doc.on("end", () => {
		buffer = Buffer.concat(buffers);
		var obj = {
			data: buffer,
			mimetype: "application/pdf",
		};
		uploadFileToS3(
			obj,
			fileName,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_INVOICE
		);
	});
	doc.end();

	return fileName;
}

async function generateHeader(doc, invoice) {
	doc.image("public/logo/app_logo.png", 50, 45, { width: 50 })
		.fillColor("#444444")
		.fontSize(20)
		.text("Mindscape Therapy", 110, 63)
		.fontSize(10)
		.text("Invoice Number: " + invoice.invoiceNumber, 200, 60, {
			align: "right",
		})
		.text("Invoice Date: " + moment().format("DD-MM-YYYY"), 200, 75, {
			align: "right",
		})
		.moveDown();
}

async function generateCustomerInformation(doc, invoice) {
	doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

	generateHr(doc, 185);

	doc.fontSize(10)
		.text("", 50, 200)
		.font("Helvetica")
		.text("Therapist Name :", 50, 200)
		.font("Helvetica-Bold")
		.text(invoice.therapistName, 130, 200)

		.fontSize(10)
		.text("", 300, 200)
		.font("Helvetica")
		.text("Patient Name :", 300, 200)
		.font("Helvetica-Bold")
		.text(invoice.patientName, 369, 200)

		.fontSize(10)
		.text("", 300, 200)
		.font("Helvetica")
		.text("Appointment Time:", 50, 220)
		.font("Helvetica-Bold")
		.text(invoice.slotStartTime, 137, 220)

		.fontSize(10)
		.text("", 300, 200)
		.font("Helvetica")
		.text("Appointment Date:", 300, 220)
		.font("Helvetica-Bold")
		.text(invoice.appointmentDate, 385, 220)

		.moveDown();

	generateHr(doc, 240);
}

async function generateInvoiceTable(doc, invoice) {
	let i;
	const invoiceTableTop = 330;

	doc.font("Helvetica-Bold");
	generateTableRow(
		doc,
		invoiceTableTop,
		"Service",
		"Amount per Service",
		"Total Minutes",
		"",
		"Total Amount"
	);
	generateHr(doc, invoiceTableTop + 20);
	doc.font("Helvetica");

	for (i = 0; i < invoice.items.length; i++) {
		const readingService = invoice.items[i];
		const position = invoiceTableTop + (i + 1) * 30;

		generateTableRow(
			doc,
			position,
			readingService.thrapieService,
			"KWD " + readingService.sessionAmount,
			readingService.totalMinutes,
			"",
			"KWD " + readingService.totalAmount
		);

		generateHr(doc, position + 20);
	}

	const subtotalPosition = 330 + (i + 1) * 30;

	generateTableRow(doc, subtotalPosition, "", "", "", "Subtotal", "KWD " + invoice.totalAmount);

	//const Commission = subtotalPosition + 20;
	//generateTableRow(doc, Commission, "", "", "", "Commission", "KWD " + invoice.adminCommission);

	//const duePosition = Commission + 20;
	//generateTableRow(doc, duePosition, "", "", "", "Platform fee", "KWD " + invoice.platformFee);

	const duePosition1 = subtotalPosition + 20;
	doc.font("Helvetica-Bold");
	generateTableRow(doc, duePosition1, "", "", "", "TOTAL", "KWD " + invoice.total);
	doc.font("Helvetica");
}

// function generateFooter(doc) {
//     doc
//         .fontSize(10)
//         .text(
//             "Payment is due within 15 days. Thank you for your business.",
//             50,
//             780,
//             { align: "center", width: 500 }
//         );
// }

function generateTableRow(doc, y, readingService, amountPerMinute, unitCost, quantity, lineTotal) {
	doc.fontSize(10)
		.text(readingService, 50, y)
		.text(amountPerMinute, 150, y)
		.text(unitCost, 280, y, { width: 90, align: "right" })
		.text(quantity, 370, y, { width: 90, align: "right" })
		.text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
	doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
	return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	return year + "/" + month + "/" + day;
}

function isValidTimezone(timezoneName) {
	// Check if the timezone name is valid by attempting to create a moment object with it
	return momentTz.tz.zone(timezoneName) !== null;
}

function create_UUID() {
	var dt = new Date().getTime();
	var uuid = "xxxxx-xxxxxx".replace(/[xy]/g, function (c) {
		var r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
	return uuid;
}

module.exports = {
	create_UUID,
	isValidTimezone,
	base64ToBufferAWS,
	getTimeSlots,
	validateAccountNumber,
	fileValidation,
	mediaPdf,
	checkPassword,
	checkPhone,
	validateEmail,
	parseDate,
	countryCodeValidation,
	nameValidation,
	usernameValidation,
	getAge,
	latLong,
	destroyImg,
	randomString,
	encryptData,
	decryptData,
	post,
	sendNotification,
	checkAlphabetExistance,
	sendMail,
	createToken,
	createAgoraToken,
	validatedate,
	validatName,
	validateIBANNumber,
	pdfValidation,
	profileValidation,
	uploadFileToS3,
	fetchFileFromS3,
	deleteFileFromS3,
	getSignedUrl,
	signURL,
	encryptPass,
	validateLeaveDate,
	getDateTimeSlots,
	randomStringPayment,
	createInvoice,
};
