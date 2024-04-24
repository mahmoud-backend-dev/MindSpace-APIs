module.exports = (sequelize, Sequelize) => {
	var therapies = sequelize.define(
		"therapies",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			therapiName: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			image: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			arabicName: {
				type: Sequelize.STRING(50),
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

	return therapies;
};
