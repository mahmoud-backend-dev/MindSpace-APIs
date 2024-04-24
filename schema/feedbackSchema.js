/**
 * Contact-Us TABLE SCHEMA
 */

module.exports = (sequelize, Sequelize) => {
	var feedback = sequelize.define("feedbacks", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		therapistId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			comment: "therapist id",
		},
		patientId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			comment: "patient id",
		},
		feedback: {
			type: Sequelize.TEXT,
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
	return feedback;
};
