exports.success = (res, respSuccessMsg) => {
  return [
    res.status(res.statusCode).send({
      status: res.statusCode,
      message: respSuccessMsg,
    }),
  ];
};

exports.resetpasswordsucess = (res, respSuccessMsg) => {
  return [
    res.status(res.statusCode).send({
      status: 200,
      message: respSuccessMsg,
    }),
  ];
};
exports.verifyemailsucess = (res, respSuccessMsg) => {
  return [
    res.status(res.statusCode).send({
      status: 200,
      message: respSuccessMsg,
    }),
  ];
};

exports.successWithdata = (
  res,
  respSuccessMsg,
  respErrorMsg,
  Query,
  condition
) => {
  return [
    res.status(res.statusCode).send({
      status: res.statusCode,
      message: Query != "" && Query != null ? respSuccessMsg : respErrorMsg,
      ...(condition == 1 ? {} : { data: Query }),
    }),
  ];
};

exports.error = (res, Msg, errormsg, condition) => {
  const codes = [200, 201, 400, 401, 404, 403, 422, 500, 209];
  const findCode = codes.find((code) => code == res.statusCode);

  if (!findCode) res.statusCode = 500;
  else statusCode = findCode;
  
  return [
    res.status(res.statusCode).send({
      status: res.statusCode,
      message: Msg,
      ...(condition == 1 ? {} : { data: errormsg }),
      // ...(errormsg ? { data: errormsg } : {}),
    }),
  ];
};
