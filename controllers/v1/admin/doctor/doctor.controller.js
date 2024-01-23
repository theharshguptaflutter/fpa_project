const tableNames = require("../../../../utils/table_name");
const bcrypt = require("bcrypt");
const {
  success,
  error,
  successWithdata,
  success1,
  resetpasswordsucess,
  resetpassworderror,
  verifyemailsucess,
} = require("../../../../utils/responseApi");

async function createDoctor(req, res) {
  try {
    const admin_id = req.params.admin_id;
    const doctor_email = req.body.doctor_email;
    const doctor_name = req.body.doctor_name;
    var password = req.body.password;

    const adminCheckQuery = await tableNames.User.findOne({
      where: { user_id: admin_id },
    });

    if (adminCheckQuery.role_id !== 3) {
      res.statusCode = 403;
      return error(res, "Unauthorized Access! Admin Only!");
    } else {
      if (!doctor_email || !doctor_name || !password) {
        res.statusCode = 404;
        return error(res, "Please provide email, name, password and role Id! ");
      }
      const checkExistingUser = await tableNames.doctorUser.findOne({
        where: { doctor_email: doctor_email },
      });

      if (checkExistingUser) {
        res.statusCode = 409;
        return error(res, "Doctor with this email already exists!");
      }

      if (password) {
        password = bcrypt.hashSync(String(password), 10);
      }
      let doctorInfo = {
        doctor_email: doctor_email,
        doctor_name: doctor_name,
        password: password,
      };
      const newDoc = await tableNames.doctorUser.create(doctorInfo);

      return res.status(201).send({
        status: 201,
        message: "Doctor created successfully",
        doctor_details: [
          {
            doctor_id: newDoc.doctor_id,
            doctor_name: newDoc.doctor_name,
            doctor_email: newDoc.doctor_email,
            password: newDoc.password,
          },
        ],
      });
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getDoctor(req, res) {
  try {
    const admin_id = req.params.admin_id;
    const doctor_email = req.body.doctor_email;
    const adminCheckQuery = await tableNames.User.findOne({
      where: { user_id: admin_id },
    });

    if (adminCheckQuery.role_id !== 3) {
      res.statusCode = 403;
      return error(res, "Unauthorized Access! Admin Only!");
    } else {
      let doctorFindQuery = await tableNames.doctorUser.findOne({
        where: { doctor_email: doctor_email },
      });
      successWithdata(
        res,
        "Doctor profle details found",
        "Doctor profile details not found",
        doctorFindQuery,
        0
      );
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function getAllDoctor(req, res) {
  try {
    const admin_id = req.params.admin_id;
    const adminCheckQuery = await tableNames.User.findOne({
      where: { user_id: admin_id },
    });

    if (adminCheckQuery.role_id !== 3) {
      res.statusCode = 403;
      return error(res, "Unauthorized Access! Admin Only!");
    } else {
      const allDoctors = await tableNames.doctorUser.findAll();

      if (allDoctors.length > 0) {
        successWithdata(
          res,
          "All Doctors found",
          "No Doctor found!",
          allDoctors,
          0
        );
      } else {
        successWithdata(res, "All Doctors found", "No Doctor found!", [], 0);
      }
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function updateDoctor(req, res) {
  try {
    const admin_id = req.params.admin_id;
    var doctor_email = req.body.doctor_email;
    var avatar = req.body.avatar;
    var password = req.body.password;
    const adminCheckQuery = await tableNames.User.findOne({
      where: { user_id: admin_id },
    });

    if (adminCheckQuery.role_id !== 3) {
      res.statusCode = 403;
      return error(res, "Unauthorized Access! Admin Only!");
    } else {
      const doc = await tableNames.doctorUser.findOne({
        where: { doctor_email: doctor_email },
      });
      if (!doc) {
        res.statusCode = 404;
        return error(res, "Doctor not found!");
      }
      if (password) {
        password = bcrypt.hashSync(String(password), 10);
      }
      let profileUpdateInfo = {
        state_id: req.body.state_id,
        city_id: req.body.city_id,
        doctor_name: req.body.doctor_name,
        doctor_email: doctor_email,
        password: password,
        gender: req.body.gender,
        avatar: avatar,
        doctor_occupation: req.body.doctor_occupation,
        doctor_specialist: req.body.doctor_specialist,
        user_profile_update: 1,
      };
      var doctorProfileUpdateParamiter = await editParameterQuery(
        profileUpdateInfo
      );
      const doctorProfileupdateQuery = await tableNames.doctorUser.update(
        doctorProfileUpdateParamiter,
        {
          where: {
            doctor_email: doctor_email,
          },
        }
      );
      if (doctorProfileupdateQuery != 0) {
        const updatedDoctorData = await tableNames.doctorUser.findOne({
          where: { doctor_email: doctor_email },
        });

        successWithdata(
          res,
          "Profile has been updated",
          200,
          updatedDoctorData.toJSON()
        );
      } else {
        res.statusCode = 404;
        error(res, "Profile  not updated please try again later... ");
      }
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function deleteDoctor(req, res) {
  try {
    const admin_id = req.params.admin_id;
    const doctor_email = req.body.doctor_email;
    const adminCheckQuery = await tableNames.User.findOne({
      where: { user_id: admin_id },
    });

    if (adminCheckQuery.role_id !== 3) {
      res.statusCode = 403;
      return error(res, "Unauthorized Access! Admin Only!");
    } else {
      if (!doctor_email) {
        res.statusCode(404);
        return error(res, "Please provide email!");
      }
      const doctorToDelete = await tableNames.doctorUser.findOne({
        where: { doctor_email: doctor_email },
      });
      if (!doctorToDelete) {
        res.statusCode = 404;
        return error(res, "Doctor not found!");
      }
      var doctorDeleteParamiter = {
        doctor_delete_flag: 1,
      };
      const deleteDoctorQuery = await tableNames.doctorUser.update(
        doctorDeleteParamiter,
        {
          where: {
            doctor_email: doctor_email,
          },
        }
      );
      if (deleteDoctorQuery) {
        const updatedDoctorData = await tableNames.doctorUser.findOne({
          where: { doctor_email: doctor_email },
        });

        successWithdata(
          res,
          "Profile has been deleted",
          200,
          updatedDoctorData.toJSON()
        );
      }
    }
  } catch (err) {
    error(res, err, 500);
  }
}

module.exports = {
  createDoctor,
  getDoctor,
  getAllDoctor,
  updateDoctor,
  deleteDoctor,
};
