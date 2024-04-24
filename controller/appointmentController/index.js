const bookAppointment = require("./bookAppointment");
const getAvailableSlots = require("./getAvailableSlots");
const getAvailableDates = require("./getAvailableDates");
const getAllAppointmentById = require("./getAllAppointmentById");
const rescheduleAppointment = require('./resheduleAppointment')
const cancleAppointment = require('./cancleAppointment')
const updatePayment = require('./updatePaymentStatus')
module.exports = {
	bookAppointment,
	getAvailableSlots,
	getAvailableDates,
	getAllAppointmentById,
	rescheduleAppointment,
	cancleAppointment,
	updatePayment

};
