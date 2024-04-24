module.exports = (sequelize, Sequelize) => {
	const appointment = sequelize.define(
		"appointments",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			patientId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			therapistId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			appointmentDate: {
				type: Sequelize.DATEONLY,
				allowNull: true,
			},
			interactionType: {
				type: Sequelize.ENUM,
				values: ["0", "1", "2"],
				allowNull: false,
				comment: "0 : Text, 1: Voice,2 : Video",
				defaultValue: "1",
			},
			slotStartTime: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			slotEndTime: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			status: {
				type: Sequelize.ENUM,
				values: ["0", "1", "2", "3","4"],
				allowNull: false,
				comment: "0 : upcoming, 1: completed,2 : canceled ,3:ongoing,4:not Attemted ",
				defaultValue: "0",
			},
			/** FOR CHAT,AUDIO,VIDEO */
			serviceStatus: {
				type: Sequelize.ENUM,
				values: ["0", "1", "2", "3", "4", "5", "6"],
				allowNull: false,
				comment:
					"0: created,1: accepted,2: rejected_By_Therpiest, 3: completed,4: started,5: running,6: timeout",
				defaultValue: "0",
			},
			channelName: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			invoice: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			invoiceNumber: {
				type: Sequelize.STRING(15),
				allowNull: false,
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
	return appointment;
};
