module.exports = (sequelize, Sequelize) => {
	var therapistLeaveDays = sequelize.define(
		"therapist_leave_days",
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
			leaveStartDate: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			leaveEndDate: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			isMorningAvailable: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			isAfternoonAvailable: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			isEveningAvailable: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
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

	return therapistLeaveDays;
};
