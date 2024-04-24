var common = require("./common");

var Sequelize = require("sequelize");

const { pagination } = require("../helpers/pagination");

/**
 * DATABASE
 */
const journalsCollections = common.db.journals;
const Op = Sequelize.Op;

async function journalsObjectRes(id) {
	var data = await journalsCollections.findOne({ where: { id: id } });

	var encryptId = await common.helpers.encryptData(data.id);

	journalsObj = {
		"id": encryptId,
		"heading": data.heading,
		"description": data.description,
		"userId": await common.helpers.encryptData(data.userId),
		"createdAt": data.createdAt,
		"updatedAt": data.updatedAt,
	};
	return journalsObj;
}

async function getAlljournals(userId, limit, page, sort, search) {
	var query = {};

	var offset = limit * (page - 1);
	if (search) {
		query.where = {
			userId: userId,
			[Op.or]: [
				{ heading: { [Op.like]: `%${search}%` } },
				{ description: { [Op.like]: `%${search}%` } },
			],
		};
	} else {
		query.where = {
			userId: userId,
		};
	}

	var count = await common.query.count(journalsCollections, query);
	query.order = [["createdAt", sort]];
	query.limit = limit;
	query.offset = offset;
	var userNotes = await common.query.find(journalsCollections, query);

	if (!userNotes || count == 0) {
		var data = "";
		return data;
	}

	var notesData = [];
	for (let i = 0; i < userNotes.length; i++) {
		const element = userNotes[i];
		var notesObj = await journalsObjectRes(element.id);
		notesData.push(notesObj);
	}

	var paginations = await pagination(limit, page, count);

	var returnObj = {
		pagination: paginations,
		data: notesData,
	};

	return returnObj;
}

module.exports = {
	journalsObjectRes,
	getAlljournals,
};
