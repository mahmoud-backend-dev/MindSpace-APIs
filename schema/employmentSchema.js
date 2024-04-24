module.exports = (sequelize, Sequelize) => {
	var employmentHistory = sequelize.define(
		"employment_histories",
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
			professionalId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			employmentHistory: {
				type: Sequelize.STRING(255),
				defaultValue: "",
			},
			noOfYears: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: true,
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

	return employmentHistory;
};
