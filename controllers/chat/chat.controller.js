const tableNames = require("../../utils/table_name");

async function chatController(app, io, socket) {
  console.log("A user connected");

  //Add Chat Message
  socket.on("add-message", async (msg) => {
    try {
      var from = msg["from"];
      var to = msg["to"];
      var inbox_id = msg["inbox_id"];
      var message = msg["message"];

      console.log(message);
      console.log(to);
      console.log(from);
      console.log(from);
      console.log(msg);

      const insertQuery = await tableNames.chatMessage.create({
        from: from,
        to: to,
        inbox_id: inbox_id,
        message: message,
        visibility: 0,
      });
      if (insertQuery != "") {
        socket.emit("success", {
          status: 200,
          message: "inserted",
        });
      } else {
        socket.emit("error", {
          status: 209,
          message: "chat  not inserted",
        });
      }
    } catch (error) {
      socket.emit("error", {
        status: 500,
        message: error,
      });
    }
  });

  //Get chat history
  socket.on("get-message", async (chat) => {
    try {
      var inbox_id = chat["inbox_id"];
      var limit = chat["limit"];
      var offset = chat["offset"];
      const findQuery = await tableNames.chatMessage.findAll({
        offset: Number.parseInt(offset ? offset : 0),
        limit: Number.parseInt(limit ? limit : 20),
        where: {
          inbox_id: inbox_id,
        },
        separate: true,
        order: [["chat_messages_id", "DESC"]],
      });

      if (findQuery != null) {
        data = JSON.stringify(findQuery);
        socket.emit("success", {
          status: 200,
          data: findQuery,
        });
      } else {
        socket.emit("error", {
          status: 209,
          message: "chat history not found",
        });
      }
    } catch (error) {
      socket.emit("error", {
        status: 500,
        message: error,
      });
    }
  });

  //Update Chat Message Seen by inbox
  //update chat message (tb) last_activity_timestamp
  socket.on("update_last_seen_chat", async (req) => {
    try {
      var inboxId = req["inbox_id"];
      var chat_message_id = req["chat_message_id"];
      var last_activity_timestamp =
        new Date().getTime() + new Date().getTimezoneOffset();

      const updateQuery = tableNames.chatMessage.update(
        {
          last_activity_timestamp: last_activity_timestamp,
          msg_seen: 1,
        },
        {
          where: {
            inbox_id: inboxId,
            chat_messages_id: chat_message_id,
          },
        }
      );
      if (updateQuery != null) {
        socket.emit("success", {
          status: 200,
          message: "updated last activity",
        });
      } else {
        socket.emit("error", {
          status: 209,
          message: "chat history not found",
        });
      }
    } catch (error) {
      socket.emit("error", {
        status: 500,
        message: error,
      });
    }
  });

  //Add user chat log
  socket.on("add_istrying_log", async (data) => {
    try {
      var user_current_id = data["user_current_id"];
      var doctor_current_id = data["doctor_current_id"];
      var isTyping = data["isTyping"];

      var last_activity_timestamp =
        new Date().getTime() + new Date().getTimezoneOffset();

      let createInfo = {
        // user_id: user_current_id,
        ...(user_current_id ? { user_id: user_current_id } : {}),
        ...(doctor_current_id ? { doctor_id: doctor_current_id } : {}),
        typing: isTyping,
        last_activity_timestamp: last_activity_timestamp,
      };

      const insertQuery = tableNames.chatMessagesLog.create(createInfo);
      if (!insertQuery) {
        socket.emit("error", {
          status: 209,
          message: "log not added try again",
        });
      } else {
        socket.emit("success", {
          status: 200,
          message: "log addded",
        });
      }
    } catch (error) {
      socket.emit("error", {
        status: 500,
        message: error,
      });
    }
  });

  //Get user log
  socket.on("get-istyping-log", async (data) => {
    try {
      var user_id = data["user_id"];
      var doctor_id = data["doctor_id"];
      const findQuery = await tableNames.chatMessagesLog.findOne({
        where: {
          ...(user_id ? { user_id: user_id } : {}),
          ...(doctor_id ? { doctor_id: doctor_id } : {}),
        },
        order: [["chat_message_log_id", "DESC"]],
        limit: 1,
      });

      if (!findQuery) {
        socket.emit("error", {
          status: 209,
          message: "log try again",
        });
      } else {
        let jsonResp = {
          status: 200,
          last_activity: findQuery,
        };

        socket.emit("success", JSON.stringify(jsonResp));
      }
    } catch (error) {
      socket.emit("error", {
        status: 500,
        message: error,
      });
    }
  });
}
module.exports = {
  chatController,
};
