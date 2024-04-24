/**
 * NPM PACKAGES
 */
require("dotenv").config();
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const express = require("express");
var app = express();
const path = require("path");
var avenue = require("./routes/index");
var fileUpload = require("express-fileupload");
const cors = require("cors");
var http = require("http").Server(app);
const socketJwt = require("./helpers/jwt");
var CronJob = require("cron").CronJob;
var io = (module.exports = require("socket.io")(http));

const {
	/**  */
	connectCall,
	/**  */
	updateSocketId,
	addToChat,
	userChatList,
	chatMessage,
	history,
	onlineUser,
	offlineUser,
	userOnLineStatus,
	RemoveInchat,
	updateAppointment,
	timer,
	getConnectStatus,
	disconnectCall,
	disConnectSocket,
} = require("./controller/socketController/socketIndex");

const { sendAppointmentNotification } = require("./controller/cronContoller/index");

io.use(function (socket, next) {
	/**
	 * SOCKET AUTHENTICATION
	 */
	var header = socket.handshake.headers;

	if (
		typeof header.authorization != "undefined" &&
		header.mindscapetoken != "" &&
		header.authorization != "" &&
		typeof header.authorization != "undefined"
	) {
		if (header.mindscapetoken == process.env.MINDSCAPETOKEN) {
			var token = header.authorization.replace(/Bearer /g, "");

			var authentication = socketJwt.socketAuthenticationVerification(token);
			if (authentication) {
				next();
			} else {
				return next(new Error("Unauthorized"));
			}
		} else {
			return next(new Error("Unauthorized"));
		}
	} else {
		next(new Error("Unauthorized"));
	}
})
	/**
	 * SOCKET CONNECTION
	 */
	.on("connection", (socket) => {
		connectCall(socket);
		updateSocketId(socket);
		addToChat(socket);
		userChatList(socket);
		chatMessage(socket);
		history(socket);
		onlineUser(socket);
		offlineUser(socket);
		userOnLineStatus(socket); // CHECK user IS online or Offline
		RemoveInchat(socket);
		updateAppointment(socket);
		timer(socket);
		getConnectStatus(socket);
		disconnectCall(socket);

		socket.on("disconnect", (reason) => {
			disConnectSocket(socket);
		});
	});

/**
 * FILE UPLOAD
 */
app.use(
	fileUpload({
		useTempFiles: false,
	})
);
app.use(cors());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/**
 * FILE READER PATH
 */

// app.use(express.static("public"));
// app.use("/public", express.static("public"));

app.use(express.static(path.join(__dirname, "./public/upload/")));
/**
 * ROUTING PATH
 */
var admins = avenue.admins;
var users = avenue.users;
var therapies = avenue.therapies;
var notes = avenue.notes;
var languages = avenue.languages;
var cms = avenue.cms;
var appointment = avenue.appointment;
var contactUs = avenue.contactUS;
var feedback = avenue.feedback;
var invoice = avenue.invoice;
var notifications = avenue.notification;
var reviews = avenue.reviews;
var banners = avenue.banners;
var reports = avenue.reports;

require("dotenv").config();
const PORT = process.env.PORT || 8000;

/**
 * BODY PARSER
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * END-POINT
 */
app.use("/api/v1/admins", admins);
app.use("/api/v1/users", users);
app.use("/api/v1/therapies", therapies);
app.use("/api/v1/notes", notes);
app.use("/api/v1/language", languages);
app.use("/api/v1/cms", cms);
app.use("/api/v1/appointment", appointment);
app.use("/api/v1/contactUs", contactUs);
app.use("/api/v1/feedback", feedback);
app.use("/api/v1/invoice", invoice);
app.use("/api/v1/notification", notifications);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/banners", banners);
app.use("/api/v1/reports", reports);

/**
 * EVERY ONE MINUTE
 */

new CronJob("* * * * *", sendAppointmentNotification.sendNotifications, null, true);

/**
 * APPLICATION LISTEN
 */

http.listen(PORT, () => {
	console.log(`Express server is running on port ${PORT}`);
});
