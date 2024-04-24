/**
 * ADMINS TABLE SCHEMA
 */
module.exports = (sequelize, Sequelize) => {
	const admin = sequelize.define("role_resources", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		resourceName: {
			type: Sequelize.STRING(50),
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
	return admin;
};
