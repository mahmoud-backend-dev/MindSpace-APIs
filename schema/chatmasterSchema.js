/**
 * CHAT-MASTER TABLE SCHEMA
 */
module.exports = (sequelize, Sequelize) => {
  const chatMaster = sequelize.define("chat_master", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    loginUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    chatUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    inChat: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    consultationFlag: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    scheduleDateTime: {
      type: Sequelize.STRING(250),
      allowNull: true,  
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
  return chatMaster;
};
