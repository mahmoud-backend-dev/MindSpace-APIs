/**
 * CMS TABLE SCHEMA 
 */
module.exports = (sequelize, Sequelize) => {
    const cms = sequelize.define("cms", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        pageKey: {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        pageTitle: {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: ""
        },
    });
    return cms;
};


