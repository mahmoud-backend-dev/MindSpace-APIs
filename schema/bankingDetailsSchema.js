

module.exports = (sequelize, Sequelize) => {
	var bankingDetails = sequelize.define(
		"bank_details",
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
			accountName: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			accountNo: {
				type: Sequelize.STRING(20),
				defaultValue: "",
				allowNull: false,
			},
			bankName: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			branchAddress: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			ibanNo: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			accountType: {
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

	return bankingDetails;
};


