const axios = require("axios");
const google = require("googleapis");
const key = require("../servicePrivateKey.json");

const sendSingleFirebaseNotification = async (fcm_token, body, title, type = null, datas = {}) => {
	try {
		var options = {
			method: "POST",
			url: "https://fcm.googleapis.com/fcm/send",
			headers: {
				Authorization: "key=" + process.env.NOTIFICATION_TOKEN_AUTHORIZATION,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				to: fcm_token,
				notification: {
					sound: "default",
					body: body,
					title: title,
					content_available: true,
					priority: "high",
				},
				data: {
					sound: "default",
					title: title,
					message: body,
					type: type,
					data: datas,
				},
			}),
		};

		if (type == "autoLogout") {
			options.body = JSON.stringify({
				to: fcm_token,
				content_available: true,
				data: { type: type },
			});
		}

		if (type == "android_call") {
			options.body = JSON.stringify({
				to: fcm_token,
				notification: {},
				data: { type: type, data: datas },
			});
		}

		let { data } = await axios.post(options.url, options.body, {
			headers: options.headers,
		});
		return data.success == 1 && true;
	} catch (error) {
		return false;
	}
};
module.exports = { sendSingleFirebaseNotification };
