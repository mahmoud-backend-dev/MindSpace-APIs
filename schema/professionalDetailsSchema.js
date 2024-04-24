module.exports = (sequelize, Sequelize) => {
	var professional = sequelize.define(
		"professionals",
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
			qualifications: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			university: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			specialization: {
				type: Sequelize.STRING(50),
				defaultValue: "",
			},
			workExperience: {
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

	return professional;
};
