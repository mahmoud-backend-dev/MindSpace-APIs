module.exports = (sequelize, Sequelize) => {
	var payemt = sequelize.define(
		"payments",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			appointmentId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			amount: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			sessionId: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			orderNo: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			paymentStatus: {
				type: Sequelize.ENUM,
				values: ["0", "1", "2", "3"],
				allowNull: false,
				comment: " 0:pending, 1:succeeded, 2:failed, 3:reversed, 4:canceled",
				defaultValue: "0",
			},
			paymentId: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			transactionId: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			referenceNo: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			invoiceUrl: {
				type: Sequelize.STRING(255),
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

	return payemt;
};
