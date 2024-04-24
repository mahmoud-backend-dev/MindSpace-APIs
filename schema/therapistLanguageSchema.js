/**
 *THERAPIST LANGUAGE TABLE SCHEMA
 */
module.exports = (sequelize, Sequelize) => {
	const therapistLanguages = sequelize.define("therapist_languages", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		languageName: {
			type: Sequelize.STRING(15),
			allowNull: false,
			defaultValue: "",
		},
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
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
	return therapistLanguages;
};
