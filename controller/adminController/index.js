const create = require("./create");
const update = require("./update");
const login = require("./login");
const forgotPassword = require("./forgotPassword");
const dashBoard = require("./dashboard");
const getByAdminId = require("./getById");
const List = require("./getList");
const Delete = require("./delete");
const getRoles = require("./getRoleResources");
const getPateients = require("./getPateientsList");
const getDoctors = require("./getDoctorsList");
const getDoctorsById = require("./doctorById");
const updateDoctor = require("./updateDoctor");
const updateSuspendAccount = require("./suspendAccount");
const ActivateDeactive = require("./updateActivate");
const doctorCreate = require("./doctorCreate");
const transactions = require("./getAllTransactionsList");

module.exports = {
	create,
	update,
	login,
	forgotPassword,
	dashBoard,
	getByAdminId,
	List,
	Delete,
	getRoles,
	getPateients,
	getDoctors,
	getDoctorsById,
	updateDoctor,
	updateSuspendAccount,
	ActivateDeactive,
	doctorCreate,
	transactions,
};
