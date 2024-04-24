/**
 * BANNERS TABLE SCHEMA
 */

module.exports = (sequelize, Sequelize) => {
	const banners = sequelize.define(
		"banners",
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
			bannerImage: {
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
	return banners;
};
