var common = require("./common");

/**
 * DATABASE
 */
const bannerCollections = common.db.banners;

async function bannerObjectRes(id) {
	var data = await bannerCollections.findOne({ where: { id: id } });

	var encryptId = await common.helpers.encryptData(data.id);

	if (data.bannerImage != "") {
		var bannerImage = await common.helpers.fetchFileFromS3(
			data.bannerImage,
			process.env.AWS_BUCKETNAME + "/" + process.env.AWS_UPLOAD_PATH_FOR_BANNERS
		);
	} else {
		var bannerImage = "";
	}

	var Obj = {
		id: encryptId,
		therapistId: await common.helpers.encryptData(data.therapistId),
		bannerImage: bannerImage,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
	return Obj;
}

module.exports = {
	bannerObjectRes,
};
