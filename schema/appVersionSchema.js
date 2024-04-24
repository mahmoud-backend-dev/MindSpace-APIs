/**
 * APP VERSIONS TABLE SCHEMA 
 */
module.exports = (sequelize, Sequelize) => {
    const appVersions = sequelize.define("app_versions", {
        androidForseUpdate: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        iOSForseUpdate: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        },
        androidVersion: {
            type: Sequelize.STRING(20),
            defaultValue: "0"
        },
        iOSVersion: {
            type: Sequelize.STRING(20),
            defaultValue: "0"
        },
    });
    return appVersions;
};