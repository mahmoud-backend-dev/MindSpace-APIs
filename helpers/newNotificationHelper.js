const axios = require("axios");
const { google } = require("googleapis");
// const key = require("../servicePrivateKey.json");

const sendSingleFirebaseNotification = async (
  fcm_token,
  body,
  title,
  type = null,
  datas = {}
) => {
  try {
    var access_token = await Generatetoken();

    var obj = {
      message: {
        token: fcm_token,
        notification: {
          title: title,
          body: body,
        },
        data: {
          title: title,
          message: body,
          type: type,
          //   datas , // Dont pass object here pass direct Key value.
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
            },
          },
        },
      },
    };

    // If they pass extra object
    obj.message.data = datas;

    var options = {
      method: "post",
      url: "https://fcm.googleapis.com/v1/projects/mindscape-34e1c/messages:send",
      headers: {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(obj),
    };

    if (type == "autoLogout") {
      options.message.body = JSON.stringify({
        token: fcm_token,
        content_available: true,
        data: { type: type },
      });
    }

    if (type == "android_call") {
      options.message.body = JSON.stringify({
        token: fcm_token,
        notification: {},
        data: { type: type, datas },
      });
    }

    axios(options)
      .then(function (response) {
        console.log("Successfully sent with response: ", response);
        return JSON.stringify(response.data);
        // resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log("push notification err--", error);
        return false;
      });

    /** Need to change the resonse check once old notfication  */
  } catch (error) {
    console.log(error);
    return false;
  }
};

const Generatetoken = () => {
  return new Promise(function (resolve, reject) {
    const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

    const jwtClient = new google.auth.JWT(
      "firebase-adminsdk-ne5fx@mindscape-34e1c.iam.gserviceaccount.com",
      null,
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDTbtSwPODPzMnY\nqm+0ZaQePTXNaTfkY/yZMEnrCjEDuYCUN/jwdHu3cJ9Py0q5v2CFzGwsONF28xRZ\noeSC7s/Ycs6oX9ZSGYISVGoHZVp2d/OpIa8S8jwN6qyzGbYQmqmqG9a8dKB/8MH/\nkmrTpdNEPPPK05rjoHK1AkJNWnJTQgPX4rQIla+dnqgDxs42yYNm2QAibs3iVVHA\nuzE29/G+eMuaLRhtfIPq59Yt7ZstXmurv/WgSIajb3EjlNDwIgdjx16uOcaUIO7F\nMIHbQm0NMUak5E+wAq7nkUWC1lVW/VDE1guq94DJoECPzrvez5BpvmvRSmab5kr5\n4inZFX77AgMBAAECggEACkJ9tKLySnMcClT+6v3m+waqW9zdYZ+jzBqGmQ6wtocO\nYQ2JmWrK7r8FeV2aiIKWYE0SpLS0dAqzSUQsrq6ATHcJuyw8s1WEind+gPxfPudu\n3fKsqFqJJShm7Uvz70CqDKn21MSYszdPb/jpZnrMp9TeBFDEr9it0vBt9OCiMpL8\nvqBUkhdUkvyP6njAgqEons5U46j38y7TVqVujFuFNmTQj6dutMZfBYb7vG1E4fun\nJYxId6Gmgq7SiB6AQCSM1fv2wBvHESYqW8wNHHEZhdXN6akZeYVEAY4uFx7rfrPC\nbHTsqhiXnlW4W78w4tyCadrUczJmKT74cJ/ps7c2yQKBgQDvMBduvvRBCCJDgPhM\n+MkBYigzW98FS8rhbxxi2MFNKBczP/1qs0z2xXTp4F16n1wG7bBB4gCUtCNXGUky\nO8fTl/5JsSaOhLJOzsOeUV/oSSwn4l0+ZzshvkIkHT1WjvQdoc+PM7raqZECM7Rg\nXS3TQ2ws2OShqHuSP0T0/HrUWQKBgQDiS1JRjn3yCj0Wi4b7pn1JtlC8TQUMV7Bu\nuXuBTqiAxbZgpkj63mreXU0l2oC2qjiqi7AmDwMRGevm0h4wVDLyiRTW5CiM7Ots\npcXOqcJEqr5sEYlMFD9+H1o9seIJ6EFZ3cE74/vUfC09n+ELf+jS+dAHIPRN2ru+\nAeTx6qGTcwKBgEgg1YAk/105CbQXiUkU4PCU3BCYzMk5EOYoboP0X15YD5751f6+\nMSBdbSM18JqQwdypArTrZUdyhxG141fNpTXOqPUqAbmKlIalXWI5odVXc4RXg8zU\nroU/bYyccKnQlBb3e7LwY5Ga/sqOMv+4OaByvYVMpq2FNDZm8/F4zcWJAoGBAJxO\nkqmq1uvcjp2H+tDQCzJjMBkgyh/gYgnZLKoAfvuTlYnk0fwWrZKyt5sx9j42DbYf\njqh7Lg8d7IgfEqMnRZmpfi+AoVHWRDdjueIp9/oeRjG3WzKlucWQOnDq8csOFjXQ\nqqyHqWb37vfl+zhKPbOcwkhqRtWQBKYWAOHow3ppAoGAQ2MkgFgAG7sWM8rP4utx\nzKr2HdBFYuQo/9mo9BDt8dyfQI4fFtHQhsxePg+9qGwzB6cev89F8KeCGpxmsC1F\nA2lGO1Eb8411C6iPxBYU1BOdYMBQ/GPrkF7wZ+CVNzUcz4xyf2kMYtBSzvT1U5Mu\nENBs6/ihG0KSsDiGNqYtbXo=\n-----END PRIVATE KEY-----\n",
      SCOPES,
      null
    );

    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
};
module.exports = { sendSingleFirebaseNotification };
