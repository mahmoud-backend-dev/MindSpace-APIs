/**
 * CHAT TABLE SCHEMA
 */
module.exports = (sequelize, Sequelize) => {
  const chat = sequelize.define("chat", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    receiverId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    messageType: {
      type: Sequelize.ENUM,
      values: ["0", "1"],
      allowNull: false,
      comment: "0:text, 1:image",
      defaultValue: "0",
    },
    readStatus: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sendBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    appointmentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "appointments",
        key: "id",
      },
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
  return chat;
};
