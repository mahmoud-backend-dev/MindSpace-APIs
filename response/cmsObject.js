var helpers = require('../helpers/helpers')

/**
 * CMS OBJECT
 * @param {OBJECT} data 
 * @returns OBJECT
 */
async function cmsObjectRes(data) {

    cmsData = {
        id: await helpers.encryptData(data.id),
        pageKey: data.pageKey,
        pageTitle: data.pageTitle,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    }

    return (cmsData)
}

module.exports = {
    cmsObjectRes
}