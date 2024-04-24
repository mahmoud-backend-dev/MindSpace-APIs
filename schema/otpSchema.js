module.exports = (sequelize, Sequelize) => {
	const OTPs = sequelize.define(
		"otps",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			phoneNumber: {
				type: Sequelize.STRING(20),
				allowNull: false,
				defaultValue: "",
			},
			otp: {
				type: Sequelize.STRING(6),
				allowNull: false,
				defaultValue: "",
			},
			expirationTime: {
				type: "TIMESTAMP",
				allowNull: true,
			},
		},
		{
			timestamps: true,
			freezeTableName: true,
		}
	);

	return OTPs;
};
