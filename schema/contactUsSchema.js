/**
 * Contact-Us TABLE SCHEMA
 */

module.exports = (sequelize, Sequelize) => {
  var contactUs = sequelize.define("contact_us", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },  
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "patient id",
    },
    name: {
      type: Sequelize.STRING(50),
      defaultValue: "",
    },
    email: {
      type: Sequelize.STRING(50),
      defaultValue: "",
    },
    message: {
      type: Sequelize.STRING(255),
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
  return contactUs;
};
