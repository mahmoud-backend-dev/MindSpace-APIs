/**
 * REVIEWS TABLE SCHEMA
 */

module.exports = (sequelize, Sequelize) => {
	const reviews = sequelize.define(
		"reviews",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			therapistId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			patientId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				defaultValue: "",
			},
			rating: {
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
		},
		{
			timestamps: true,
			freezeTableName: true,
		}
	);
	return reviews;
};
