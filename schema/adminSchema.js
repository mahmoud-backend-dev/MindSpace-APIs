/**
 * ADMINS TABLE SCHEMA
 */
module.exports = (sequelize, Sequelize) => {
  const admin = sequelize.define("admins", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fullName: {
      type: Sequelize.STRING(50),
      defaultValue: "",
    },
    email: {
      type: Sequelize.STRING(50),
      defaultValue: "",
    },
    password: {
      type: Sequelize.STRING(255),
      defaultValue: "",
    },
    phone: {
      type: Sequelize.STRING(15),
      allowNull: false,
      defaultValue: "",
    },
    profile: {
      type: Sequelize.STRING(50),
      defaultValue: "",
    },
    assignRole: {
      type: Sequelize.ENUM,
      values: ["0", "1"],
      allowNull: false,
      comment: "0:supervisor, 1:junior supervisor",
      defaultValue: '0',
    },
    randomString: {
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
  });
  return admin;
};
