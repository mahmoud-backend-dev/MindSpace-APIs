module.exports = (sequelize, Sequelize) => {
	var usersNotifications = sequelize.define("users_notifications", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		notificationId: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		sendBy: {
			type: Sequelize.ENUM,
			values: ["0", "1"],
			allowNull: false,
			comment: "0: admin, 1: application",
			defaultValue: "0",
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
	return usersNotifications;
};
