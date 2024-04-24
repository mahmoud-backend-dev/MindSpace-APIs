var helpers = require("../helpers/helpers");

/**
 * SEND CHAT OBJECT
 * @param {OBJECT} data
 * @returns OBJECT
 */
async function sendChatObjectRes(data) {

  // var sendChatData = {
  //     id: await helpers.encryptData(data.id),
  //     senderId : await helpers.encryptData(data.clientId),
  //     receiverId : await helpers.encryptData(data.psychicId),
  //     decryptedPsychicId: data.psychicId,
  //     readingRequestId: await helpers.encryptData(data.readingRequestId),
  //     sendBy: parseInt(data.sendBy),
  //     messageType: parseInt(data.messageType),
  //     message: parseInt(data.messageType) == 1 ? process.env.imagePathUser + 'chatVideos/' + data.message : data.message,
  //     isNew: data.isNew ? data.isNew : 0,
  //     createdAt: data.createdAt,
  // }

  var sendChatData = {
    id: data.id,
    senderId: data.senderId,
    receiverId: data.receiverId,
    senderName: data.senderName,
    message:data.message,
    isNew: data.isNew ? data.isNew : 0,
    createdAt: data.createdAt,
  };

  return sendChatData;
}

/**
 * CHAT USERS
 * @param {*} data
 * @param {*} userData
 * @returns
 */
async function chatUserObjectRes(data, userData, unreadCount) {
  var chatUserData = {
    id: await helpers.encryptData(data.id),
    clientId: await helpers.encryptData(data.clientId),
    decryptedClientId: data.clientId,
    psychicId: await helpers.encryptData(data.psychicId),
    decryptedPsychicId: data.psychicId,
    readingRequestId: await helpers.encryptData(data.readingRequestId),
    requestedMinutes: data.readingRequests.requestedMinutes
      ? data.readingRequests.requestedMinutes
      : 0,
    readingService: parseInt(data.readingRequests.readingService),
    status: parseInt(data.readingRequests.status),
    sendBy: data.sendBy,
    message: data.message,
    messageType: parseInt(data.messageType),
    createdAt: data.createdAt,
    unreadCount: unreadCount,
    username: userData.username ? userData.username : "",
    profile: userData.profile
      ? process.env.imagePathUser + "profile/" + userData.profile
      : "",
    onlineStatus: parseInt(userData.onlineStatus),
    blockedByPsychic: userData.blockedByPsychic,
  };

  return chatUserData;
}

/**
 * UPDATE IN CHAT OBJECT
 * @param {Object} data
 * @returns
 */
async function updateInChatObject(data) {
  chatUserData = {
    id: await helpers.encryptData(data.id),
    clientId: await helpers.encryptData(data.clientId),
    psychicId: await helpers.encryptData(data.psychicId),
    loginUser: parseInt(data.loginUser),
    liveChatInChatFlag: parseInt(data.liveChatInChatFlag),
    videoReplyInChatFlag: parseInt(data.videoReplyInChatFlag),
    textInChatFlag: parseInt(data.textInChatFlag),
    anotherUserInChat: parseInt(data.anotherUserInChat),
  };
  return chatUserData;
}

module.exports = {
  sendChatObjectRes,
  chatUserObjectRes,
  updateInChatObject,
};
