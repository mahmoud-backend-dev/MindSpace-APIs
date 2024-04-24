/**
 * LANGUAGE TABLE SCHEMA
 */
module.exports = (sequelize, Sequelize) => {
	const language = sequelize.define("languages", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		languageName: {
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
	return language;
};
