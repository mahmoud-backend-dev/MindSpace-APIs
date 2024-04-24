/**
 * JOURNALS TABLE SCHEMA
 */

module.exports = (sequelize, Sequelize) => {
	const journal = sequelize.define(
		"journals",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			heading: {
				type: Sequelize.TEXT,
				defaultValue: "",
			},
			description: {
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
	return journal;
};
