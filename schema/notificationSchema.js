

module.exports = (sequelize, Sequelize) => {
	var Notifications = sequelize.define("notifications", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		key: {
			type: Sequelize.STRING(255),
			defaultValue: "",
		},
		title: {
			type: Sequelize.STRING(255),
			defaultValue: "",
		},
		message: {
			type: Sequelize.STRING(255),
			defaultValue: "",
		},
		data: {
			type: Sequelize.STRING(255),
			defaultValue: "",
		},
		createdAt: {
			type: "TIMESTAMP",
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			allowNull: false,
		},
		updatedAt: {
			type: "TIMESTAMP",
			defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			allowNull: false,
		},
	});
	return Notifications;
};
