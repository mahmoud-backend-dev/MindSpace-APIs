/**
 * RESPONSE COMMON MODULE
 */
function Response() {
	this.code = 200;
	this.success = true;
	this.message = "";
	this.data = [];
	this.err = {};
}

/**
 * GET RESPONSE
 */
function ResponseGet() {
	this.code = 200;
	this.success = true;
	this.message = "";
	this.data = {};
	this.err = {};
	this.pagination = {};
}

/**
 * SUCCESS GET RESPONSE WITH PAGINATION
 * @param {string} message
 * @param {array} payload
 * @param {array} err
 * @param {object} pagination
 * @returns object
 */
function successGetResponse(message, payload, err, pagination) {


	let response = new ResponseGet();
	response.code = 200;
	response.success = true;
	response.message = message;
	response.data = payload;
	response.err = err;
	response.pagination = pagination;
	return response;
}

/**
 *SUCCESS CREATE RESPONSE
 * @param {string} message
 * @param {array} payload
 * @param {array} err
 * @returns object
 */
function successCreateResponse(message, payload, err) {
	let res = new Response();
	res.code = 201;
	res.success = true;
	res.message = message;
	res.data = payload;
	res.err = err;
	return res;
}

/**
 * SUCCESS RESPONSE
 * @param {string} message
 * @param {array} payload
 * @param {array} err
 * @returns object
 */
async function successResponse(message, payload, err) {
	let res = new Response();
	res.code = 200;
	res.success = true;
	res.message = message;
	res.data = payload;
	res.err = err;
	return res;
}

/**
 * ERROR RESPONSE
 * @param {string} message
 * @param {array} payload
 * @param {array} err
 * @returns object
 */
async function failResponse(message, payload, err) {
	let res = new Response();
	res.code = 400;
	res.success = false;
	res.message = message;
	res.data = payload;
	res.err = err;
	return res;
}

/**
 * ERROR OBJECT RESPONSE
 * @param {STRING} message
 * @param {STRING} param
 * @param {STRING} location
 * @returns
 */
async function resObj(code, message, param, location) {
	let resObj = {
		"code": code,
		"msg": message,
		"param": param,
		"location": location,
	};

	return resObj;
}
function dataNotFound(message, payload) {
	let res = new Response();
	res.code = 404;
	res.success = true;
	res.message = message;
	res.data = payload;
	res.err = payload;
	return res;
}
module.exports = {
	successResponse,
	failResponse,
	successCreateResponse,
	successGetResponse,
	resObj,
	dataNotFound,
};
