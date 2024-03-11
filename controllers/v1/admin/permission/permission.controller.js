// update admin and staff profiles
const tableNames = require("../../../../utils/table_name");
const { s3Upload, s3VideoUpload } = require("../../../../utils/s3_file_upload");
const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");
const editParameterQuery = require("../../../../utils/edit_query");


async function addStaffPermission(req, res) {
  try {

    var user_id = req.body.user_id;
    var room_permission_id  = req.body.room_permission_id ;


    let permissionInfo = {
        user_id: user_id,
        room_permission_id: room_permission_id,
    };

    const userFindQuery = await tableNames.User.findOne({where:{
      user_id: user_id,
    }})
    

    if(userFindQuery.role_id == 2){

      const permissionFindQuery = await tableNames.userRoomPermission.findOne({where:{
        user_id: user_id,
        room_permission_id: room_permission_id,
      }});
      if(permissionFindQuery != null){
        error(res, "This permission already given");
      }else{
      const permissionQuery = await tableNames.userRoomPermission.create(permissionInfo);
      if (permissionQuery != null) {
        successWithdata(res, "Permission has been uploaded", 200, permissionQuery);
      } else {
        res.statusCode = 409;
        error(res, "Permission not updated please try again later");
      }
    }
    }else{
      res.statusCode = 209;
      error(res, "this user is not a staff..",);
    }
  } catch (err) {
    error(res, err, 500);
  }
}

async function staffDeletePermission(req, res) {
  try {
    var user_id = req.body.user_id;
    var room_permission_id  = req.body.room_permission_id;

    const userFindQuery = await tableNames.User.findOne({where:{
      user_id: user_id,
    }})
    

    if(userFindQuery == null){
      error(res, "User not found");
    }else{
      var staffRoomPermissionDeleteQuery = await tableNames.userRoomPermission.destroy(
        {
          where: {
            user_id:user_id,
            room_permission_id:room_permission_id  
          },
        }
      );

      console.log(staffRoomPermissionDeleteQuery);
     
      if (staffRoomPermissionDeleteQuery == 1) {
       
       successWithdata(res, "User Permission has been Deleted", 200, staffRoomPermissionDeleteQuery,1);
      } else {
         res.statusCode = 409;
        error(res, "User Permission not deleted please try again later");
      }
    }
  } catch (err) {
    error(res, "err", 500);
  }
}

async function addDoctorPermission(req, res) {
    try {
  
      var doctor_id = req.body.doctor_id;
      var room_permission_id  = req.body.room_permission_id ;
  
  
      let permissionInfo = {
          doctor_id: doctor_id,
          room_permission_id: room_permission_id,
      };

      const doctorFindQuery = await tableNames.doctorUser.findOne({where:{
        doctor_id: doctor_id,
      }})
      
      
      if(doctorFindQuery != null){
        const permissionFindQuery = await tableNames.doctorRoomPermission.findOne({where:{
          doctor_id: doctor_id,
          room_permission_id: room_permission_id,
        }});
        if(permissionFindQuery != null){
          error(res, "This permission already given");
        }else{
        const permissionQuery = await tableNames.doctorRoomPermission.create(permissionInfo);
        if (permissionQuery != null) {
          successWithdata(res, "Permission has been uploaded", 200, permissionQuery);
        } else {
          res.statusCode = 409;
          error(res, "Permission not updated please try again later");
        }
        }
      }else{
        res.statusCode = 404;
          error(res, "Doctor Not found");
      }
  

    } catch (err) {
      error(res, err, 500);
    }
}

async function doctorDeletePermission(req, res) {
  try {
    var doctor_id = req.body.doctor_id;
    var room_permission_id  = req.body.room_permission_id;


    var doctorRoomPermissionDeleteQuery = await tableNames.doctorRoomPermission.destroy(
      {
        where: {
          doctor_id:doctor_id,
          room_permission_id:room_permission_id
        },
      }
    );
   
    if (doctorRoomPermissionDeleteQuery == 1) {
      successWithdata(res, "Dortor Permission has been Deleted", 200, doctorRoomPermissionDeleteQuery,1);
    } else {
      res.statusCode = 409;
      error(res, "Dortor Permission not deleted please try again later");
    }
  } catch (err) {
    error(res, err, 500);
  }
}




module.exports = {
  addStaffPermission,
    addDoctorPermission,
 
  doctorDeletePermission,
  staffDeletePermission
  
};
