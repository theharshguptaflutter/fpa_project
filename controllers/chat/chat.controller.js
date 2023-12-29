const tableNames = require("../../utils/table_name");
const { success, error } = require("../../utils/responseApi");

async function addInbox(req, res) {
  try {
    findQuery = await tableNames.State.findAll({
      attributes: ["state_id", "state_name"],
      where: { delete_flag: 0 },
    });
    if (findQuery != "") {
      res.status(200).send({
        status: 200,
        message: "Data found",
        data: findQuery,
      });
    } else {
      res.status(404).send({
        status: 404,
        message: "Not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
}

async function getInbox(req, res) {
  state_id = req.query.state_id;

  let where = {
    delete_flag: 0,
    ...(state_id
      ? {
          state_id: state_id,
        }
      : {}),
  };
  let paranoid = { paranoid: true };
  findQuery = await tableNames.City.findAll({
    attributes: ["city_id", "state_id", "city_name"],
    where,
    paranoid,
  });

  if (findQuery != "") {
    res.status(200).send({
      status: 200,
      message: "Data found",
      data: findQuery,
    });
  } else {
    res.status(404).send({
      status: 404,
      message: "No cities found",
    });
  }
}

async function addMessage(req, res) {
  let where = {
    delete_flag: 0,
  };
  let paranoid = { paranoid: true };
  findQuery = await tableNames.Category.findAll({
    attributes: ["category_id", "category_name"],
    where,
    paranoid,
  });

  if (findQuery != "") {
    res.status(200).send({
      status: 200,
      message: "Data found",
      data: findQuery,
    });
  } else {
    res.status(404).send({
      status: 404,
      message: "No cities found",
    });
  }
}

async function getMessage(req, res) {
  let where = {
    delete_flag: 0,
  };
  let paranoid = { paranoid: true };
  findQuery = await tableNames.Role.findAll({
    attributes: ["role_id", "role_name"],
    where,
    paranoid,
  });

  if (findQuery != "") {
    res.status(200).send({
      status: 200,
      message: "Data found",
      data: findQuery,
    });
  } else {
    res.status(404).send({
      status: 404,
      message: "No cities found",
    });
  }
}
module.exports = {
  addInbox,
  getInbox,
  addMessage,
  getMessage,
};
