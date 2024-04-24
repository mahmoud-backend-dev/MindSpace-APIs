module.exports = (sequelize, Sequelize) => {
	const Users = sequelize.define(
		"users",
		{
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			role: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "0 : Therapist , 1 : patient",
			},
			firstName: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			lastName: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			nickName: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			loginType: {
				type: Sequelize.INTEGER,
				allowNull: true,
				comment: "0 : email, 1 : google, 2: apple",
			},
			appleId: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			googleId: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			facebookId: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			facebookLink: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			civilId: {
				type: Sequelize.STRING(50),
				allowNull: false,
				defaultValue: "",
			},
			linkedinId: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			instagramId: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			email: {
				type: Sequelize.STRING(150),
				allowNull: false,
				defaultValue: "",
			},
			dob: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			countryCode: {
				type: Sequelize.STRING(10),
				allowNull: false,
				defaultValue: "",
			},
			mobileNumber: {
				type: Sequelize.STRING(15),
				allowNull: false,
				defaultValue: "",
			},
			eCountryCode: {
				type: Sequelize.STRING(10),
				allowNull: false,
				defaultValue: "",
			},
			emergencyNumber: {
				type: Sequelize.STRING(15),
				allowNull: false,
				defaultValue: "",
			},
			gender: {
				type: Sequelize.ENUM,
				values: ["0", "1", "2", "3"],
				allowNull: false,
				comment: "0: Default ,1 : Male, 2 : Female,3 : Others",
				defaultValue: "0",
			},
			address: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			city: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			country: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			isActive: {
				type: Sequelize.ENUM,
				values: ["0", "1", "2", "3"],
				allowNull: false,
				comment: "0: Pending ,1 : Active, 2 : inComplete,3 : Declined , 4:register",
				defaultValue: "0",
			},
			profileImage: {
				type: Sequelize.STRING(255),
				allowNull: false,
				defaultValue: "",
			},
			isProfileSet: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			personalDetailsFlag: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			professionalFlag: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			therapiesFlag: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			certificationFlag: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			bankDetailsFlag: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			workDaysDetailsFlag: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "0 : inactive , 1 : active , 2:banned , 3:pending",
				defaultValue: false,
			},
			isEmailVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			isNotification: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			isChat: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			isVoice: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			isVideo: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			chatSessionPrice: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
			voiceSessionPrice: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
			videoSessionPrice: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
			isConsultNow: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			chatConsultNowPrice: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
			voiceConsultNowPrice: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
			videoConsultNowPrice: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
			joinUs: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			reason: {
				type: Sequelize.STRING(255),
				defaultValue: "",
			},
			timezone: {
				type: Sequelize.STRING(255),
				defaultValue: "",
			},
			isSuspend: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			suspendReason: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			suspendSubject: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			randomString: {
				type: Sequelize.STRING(255),
				defaultValue: "",
			},
			deviceToken: {
				type: Sequelize.STRING(255),
				defaultValue: "",
			},
			deviceType: {
				type: Sequelize.ENUM,
				values: ["A", "I"],
				allowNull: true,
				comment: "A : android , I : ios",
				defaultValue: "A",
			},
			deviceId: {
				type: Sequelize.STRING(255),
				defaultValue: "",
			},
			voIpToken: {
				type: Sequelize.STRING(255),
				defaultValue: "",
			},
			socketId: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			onlineStatus: {
				type: Sequelize.ENUM,
				values: ["0", "1", "2"],
				allowNull: false,
				comment: "0 :online , 1 : busy , 2:offline",
				defaultValue: "2",
			},
			activeAt: {
				// For socket if user Offline time
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
				allowNull: false,
			},
			isDeleted: {
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

	return Users;
};
