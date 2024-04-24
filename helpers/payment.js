const axios = require("axios");
var common = require("../controller/common");
const payment = async (amount, customerPhone, customerName) => {
	try {
		var orderNo = "";
		var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		var charactersLength = characters.length;
		for (var i = 0; i < 6; i++) {
			orderNo += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		var options = {
			method: "POST",
			url: "https://pay.trymindscape.com/b/checkout/v1/pymt-txn/",
			headers: {
				Authorization: "Api-Key" + " " + process.env.API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"type": "payment_request",
				"pg_codes": [process.env.pgcode],
				"amount": amount,
				"currency_code": "KWD",
				"customer_phone": customerPhone,
				"order_no": orderNo,
				"full_name": customerName,
			}),
		};

		var response = await axios.post(options.url, options.body, {
			headers: options.headers,
		});
		if (response.status == 201) {
			var returnObj = {
				status: 201,
				checkout_url: response.data.checkout_url,
				sessionId: response.data.session_id,
				state: response.data.state,
				amount: response.data.amount,
				orderNo: response.data.order_no,
			};
			return returnObj;
		}
	} catch (error) {
		var returnObj = {
			status: error.response.status,
			data: error.response.data,
		};
		return returnObj;
	}
};

const getPaymentStatus = async (paymentId) => {
	try {
		var options = {
			method: "GET",
			url:
				"https://pay.trymindscape.com/b/api/v1/plugins/payment_request/transaction/details/" +
				paymentId,
			headers: {
				Authorization: "Api-Key" + " " + process.env.API_KEY,
				"Content-Type": "application/json",
			},
		};
		var response = await axios.get(options.url, {
			headers: options.headers,
		});
		return response;
	} catch (error) {
		return error.response.data
	}
};

module.exports = { payment, getPaymentStatus };
