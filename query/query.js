var responseServices = require("../services/errorService");

/**
 * TO GET ERROR DETAILS
 * @param {STRING} key
 * @returns STRING
 */
async function error(key) {
  var data = await responseServices.successOrErrors(key);
  return data;
}

/**
 * INSERT QUERY
 */
let create = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .create(query)
      .then((result) => {
        return resolve(result);
      })
      .then((err) => {
        return reject(err);
      });
  });
};

/**
 * FIND ALL QUERY
 */
let find = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .findAll(query)
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject({ message: "DB query Failed :" + err });
      });
  });
};

/** FIND AND COUNT ALL */
let findAndCountAll = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .findAndCountAll(query)
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject({ message: "DB query Failed :" + err });
      });
  });
};

/**
 * FIND WHERE QUERY
 */
let findSome = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .findAll({ where: query })
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject({ message: "DB query Failed :" + err });
      });
  });
};

/**
 * FIND QUERY IN PAGINATION
 */
let findWithPagination = (collection, query, limit, offset) => {
  return new Promise((resolve, reject) => {
    collection
      .findAll({
        limit,
        offset,
        where: query,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

/**
 * FIND ONE QUERY
 */
let findOne = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .findOne(query)
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

/**
 * UPDATE QUERY
 */
let update = (collection, findBy, query) => {
  return new Promise((resolve, reject) => {
    collection
      .update(query, { where: findBy })
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

/**
 * REMOVE QUERY
 */
let remove = async (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .destroy({ where: query })
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

/**
 * DELETE MANY
 */
let deleteMany = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .destroy({ where: query })
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

let bulkCreate = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .bulkCreate(query)
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

let count = (collection, query) => {
  return new Promise((resolve, reject) => {
    collection
      .count(query)
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

module.exports = {
  findAndCountAll,
  error,
  create,
  find,
  findOne,
  update,
  remove,
  findWithPagination,
  findSome,
  deleteMany,
  bulkCreate,
  count,
};
