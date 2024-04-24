const connectCall = require("./connectCall");
const updateSocketId = require("./updateSocketId");
const addToChat = require("./addToChatMaster");
const userList = require("./userList");
const chatMessage = require("./chatMessage");
const history = require("./chatHistory");
const online = require("./onlineOffline");
const offline = require("./onlineOffline");
const userLogin = require("./userOnlineStatus");
const inChat = require("./inChatRemove");
const appointmentStatus = require("./updateAppointmenReadingStatus");
const appointmentTimer = require("./timerSocket");
const getConnectStatus = require("./getConnectStatus");
const disconnectCall = require("./disconnectCall");
const disConnectSocket = require('./disconnectSocket')
module.exports = {
	connectCall,
	updateSocketId,
	addToChat,
	userList,
	chatMessage,
	history,
	online,
	offline,
	userLogin,
	inChat,
	appointmentStatus,
	appointmentTimer,
	getConnectStatus,
	disconnectCall,
	disConnectSocket
};
