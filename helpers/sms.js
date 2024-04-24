const https = require('https');
const { query } = require("../query");
const db = require("../schema/db");
const helpers = require("./helpers");
const { Op } = require('sequelize');
const commonEmail = require("../services/mailService.js/contactSupport");

const otpCollection = db.otps;
const usersCollection = db.users;

const username = process.env.kwtSMS_username;
const password = process.env.kwtSMS_password;


const verifyOtp = async (countryCode, mobileNumber, code) => {
	var storedOTP = await query.findOne(otpCollection, {
		where: {phoneNumber: countryCode+mobileNumber, 
				otp: code,
				expirationTime: {  [Op.gt]: new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ') }}
	});
	return storedOTP !== null;
};

const sendOtp = async (countryCode, phone, email) => {
	const otp = generateOTP();
	sendGeneratedOTPSMS(countryCode.replace('+',  '') + phone, otp);
	await sendGeneratedOTPEmail(email, otp);
	await saveOTP(countryCode.replace('+',  '') , phone, otp);
	return otp;
};

module.exports = {
	verifyOtp,
	sendOtp,
};


function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendGeneratedOTPSMS(phoneNumber, otp) {
	const message = `${otp} رمز تعريفك الخاص ب Mindscape OTP هو`;
  
	let postData = {
		"username": username,
		"password": password,
		"test": "0",
		"sender": "Mindscape Auth",
		"mobile": phoneNumber,
		"lang": "3",
		"message": message
	};
	
	let dataEncoded = JSON.stringify(postData);

	const options = {
		hostname: 'www.kwtsms.com',
		path: '/API/send/',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
		}
	};

	const req = https.request(options);

	req.write(dataEncoded);
	req.end();
}

async function sendGeneratedOTPEmail (email, otp) {
	const message = 
	`Dear Mindscape User,<br><br>

	Your OTP ID is: ${otp}.<br><br>

	Please use this one-time password for account verification and secure access to your Mindscape account. Do not share this OTP with anyone.<br><br>
	
	Thank you,<br>
	Mindscape Support`;

	await helpers.sendMail(message, "Mindscape OTP", email);
}


async function saveOTP(countryCode, phone, otp) {

	await query.deleteMany(otpCollection, {
		phoneNumber: countryCode + phone
	});
	let storedOPT = await query.create(otpCollection, {
		phoneNumber: countryCode + phone,
		otp: otp,
		expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
	});
}