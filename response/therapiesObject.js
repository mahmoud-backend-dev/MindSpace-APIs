const helpers = require("../helpers/helpers");

var common = require("./common");
const therapieImage =
	process.env.AWS_URL +
	"/" +
	process.env.AWS_BUCKETNAME +
	"/" +
	process.env.AWS_UPLOAD_PATH_FOR_THERAPY;

async function therapiesObjectRes(data) {
	var encryptId = await common.helpers.encryptData(data.id);

	var url = await common.helpers.fetchFileFromS3(
		data.image,
		process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_THERAPY
	);

	therapiesObj = {
		"id": encryptId,
		"therapiName": data.therapiName,
		"arabicName": data.arabicName,
		"image": url,
		"createdAt": data.createdAt,
		"updatedAt": data.updatedAt,
	};
	return therapiesObj;
}

module.exports = {
	therapiesObjectRes,
};
