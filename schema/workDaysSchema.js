module.exports = (sequelize, Sequelize) => {
	var therapistWorkDays = sequelize.define(
		"therapist_work_days",
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
			dayOfWeek: {
				type: Sequelize.STRING(15),
				allowNull: false,
				defaultValue: "",
			},
			morningStartTime: {
				type: Sequelize.TIME,
			},
			morningEndTime: {
				type: Sequelize.TIME,
			},
			isMorningAvailable: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			afternoonStartTime: {
				type: Sequelize.TIME,
			},
			afternoonEndTime: {
				type: Sequelize.TIME,
			},
			isAfternoonAvailable: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			eveningStartTime: {
				type: Sequelize.TIME,
			},
			eveningEndTime: {
				type: Sequelize.TIME,
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

	return therapistWorkDays;
};
