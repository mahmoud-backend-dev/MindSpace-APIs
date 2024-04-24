module.exports = (sequelize, Sequelize) => {
	var certifications = sequelize.define(
		"certifications",
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

			document: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			documentType: {
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
	return certifications;
};
