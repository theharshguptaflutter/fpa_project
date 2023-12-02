const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

const operatorsAliases = {
  $eq: Op.eq,
  $or: Op.or,
  $like: Op.like,
  $in: Op.in,
  $gte: Op.gte,
  $gt: Op.gt,
  $and: Op.and,
  $lte: Op.lte,
  $between: Op.between,
  $not: Op.not,
  $ne: Op.ne,
};

module.exports = operatorsAliases;
