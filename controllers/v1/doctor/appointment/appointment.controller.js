const tableNames = require("../../../../utils/table_name");

const {
  success,
  error,
  successWithdata,
} = require("../../../../utils/responseApi");

async function getAppointmentDoctorHistory(req, res) {
  const { doctor_id } = req.params;

  try {
    const doctorAppointmentHistory =
      await tableNames.appointmentBooking.findAll({
        include: [
          {
            attributes: ["user_id", "name", "email", "user_number", "avatar"],
            model: tableNames.User,
          },
          {
            attributes: ["booking_status_name"],
            model: tableNames.bookingStatus,
          },
          {
            attributes: ["meeting_room_id"],
            model: tableNames.meetingRoom,
            include: [
              {
                attributes: ["room_code"],
                model: tableNames.Room,
              },
            ],
          },
        ],
        where: {
          booking_status_id: 1,
          doctor_id: doctor_id,
        },
      });

    successWithdata(
      res,
      "Doctor appointment history found",
      "Doctor appointment history not found",
      doctorAppointmentHistory,
      0
    );
  } catch (err) {
    error(res, err, 500);
  }
}

async function getAppointmentByIdHistory(req, res) {
  const { appointment_booking_id } = req.params;

  try {
    const userAppointmentHistory = await tableNames.appointmentBooking.findOne({
      include: [
        {
          attributes: ["user_id", "name", "email", "user_number", "avatar"],
          model: tableNames.User,
        },
        {
          attributes: ["booking_status_name"],
          model: tableNames.bookingStatus,
        },
        {
          attributes: ["meeting_room_id"],
          model: tableNames.meetingRoom,
          include: [
            {
              attributes: ["room_code"],
              model: tableNames.Room,
            },
          ],
        },
      ],
      where: {
        // booking_status_id: 1,
        appointment_booking_id,
      },
    });
    successWithdata(
      res,
      "Doctor appointment history found",
      "Doctor appointment history not found",
      userAppointmentHistory,
      0
    );
  } catch (err) {
    error(res, err, 500);
  }
}

async function appointmentComplete(req, res) {
  try {
    const appointment_booking_id = req.params.appointment_booking_id;
    const email = req.body.email;
    const user = await tableNames.doctorUser.findOne({
      where: { doctor_email: email },
    });
    if (!user) {
      res.statusCode = 404;
      return error(res, "User not found!");
    }
    var doctor_id = user.doctor_id;
    if (
      appointment_booking_id == "" ||
      appointment_booking_id == null ||
      doctor_id == "" ||
      doctor_id == null
    ) {
      return error(res, "Invalid parameters");
    }

    const appointmentCancelQuery = await tableNames.appointmentBooking.update(
      {
        booking_status_id: 5, // 5 means Appointment completed
        //appointment_delete_flag: 1,
      },
      {
        where: {
          appointment_booking_id: appointment_booking_id,
          doctor_id: doctor_id,
        },
      }
    );
    if (appointmentCancelQuery[0] == 1) {
      const findMeetingRoomId = await tableNames.meetingRoom.findOne({
        where: { appointment_booking_id: appointment_booking_id },
      });

      if (findMeetingRoomId == "" || findMeetingRoomId == null) {
        return error(res, "Invalid meeting room id");
      } else {
        const findRoomId = await tableNames.Room.findOne({
          where: { room_id: findMeetingRoomId.room_id },
        });

        if (findRoomId == "" || findRoomId == null) {
          return error(res, "Invalid room id");
        } else {
          const roomCancelQuery = await tableNames.Room.update(
            {
              room_active: 0, // 0 means room is available
            },
            { where: { room_id: findRoomId.room_id } }
          );
          if (roomCancelQuery[0] == 1) {
            const meeting_room_delete_Query =
              await tableNames.meetingRoom.destroy({
                where: {
                  appointment_booking_id: appointment_booking_id,
                },
              });
          } else {
            return error(res, "Your room has not been update");
          }
        }
      }

      success(res, "Your appointment has been completed", 200, 0);
    } else {
      error(res, "Your appointment has not been completed");
    }

    console.log(appointmentCancelQuery);
  } catch (err) {
    error(res, err, 500);
  }
}
module.exports = {
  getAppointmentDoctorHistory,
  getAppointmentByIdHistory,
  appointmentComplete,
};
