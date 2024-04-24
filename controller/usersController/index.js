const createUser = require("./create");
const usersList = require("./list");
const consultNow = require("./consultNow");
const uploadDocument = require("./uploadCertificates");
const getByUserid = require("./getByid");
const updateUser = require("./update");
const deleteUser = require("./delete");
const loginUser = require("./login");
const forgotPassword = require("./forgotPassword");
const blockUnblockUser = require("./blockUnblock");
const logoutUser = require("./logout");
const changePassword = require("./changePassword");
const userExists = require("./userExists");
const notification = require("./notification");
const activate = require("./activate");
const addNotes = require("../journalController/addNotes");
const getNotes = require("../journalController/getNotes");
const updatePatient = require("./updatePatient");
const deleteDocument = require("./deleteDocument");
const getAllTherapistCity = require("./getAllTherapistCity");
const addWorkDays = require("./workDays");
const doctorByPatientId = require("./getDoctorByPatientId");
const sendOtp = require("./sendOtp");

module.exports = {
	createUser,
	usersList,
	consultNow,
	getByUserid,
	updateUser,
	deleteUser,
	loginUser,
	forgotPassword,
	blockUnblockUser,
	activate,
	logoutUser,
	changePassword,
	uploadDocument,
	userExists,
	notification,
	addNotes,
	getNotes,
	updatePatient,
	deleteDocument,
	getAllTherapistCity,
	addWorkDays,
	doctorByPatientId,
	sendOtp,
};
