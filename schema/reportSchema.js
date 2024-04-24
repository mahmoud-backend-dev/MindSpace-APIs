/**
 * REPORTS TABLE SCHEMA
 */

module.exports = (sequelize, Sequelize) => {
  const reports = sequelize.define(
    "reports",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.STRING(100),
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
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sessionSummary: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      homeWork: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      topicQuestions: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      comments: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      interventionNeeded: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      reportUrl: {
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
  return reports;
};
