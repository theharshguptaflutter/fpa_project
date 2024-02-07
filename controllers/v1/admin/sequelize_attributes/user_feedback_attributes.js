// class userFeedbackAttributesLists {
//     userBookingFeedbackAttributesList = [
//         "user_booking_feedback_id",
//         "stars",
//         "comment",
//         "field1",
//         "field2",
//         "field3",
//         "field4",
//         "field5",
//         "field6",
//         "field7",
//         "field8",
//         "field9",
//         "field10",
//     ];

//     appointmentBookingAttributesList = [
//         "appointment_booking_id",
//         "total_booking_price",
//         "order_status",
//         "booked_current_date",
//         "booked_current_time",
//         "user_review_flag",
//         "doctor_review_flag",
//     ];

//     bookingStatusAttributesList = [
//         "booking_status_id", "booking_status_name"
//     ];
// }

class userFeedbackAttributesLists {
    constructor() {
        this.userBookingFeedbackAttributesList = [
            "user_booking_feedback_id",
            "stars",
            "comment",
            "field1",
            "field2",
            "field3",
            "field4",
            "field5",
            "field6",
            "field7",
            "field8",
            "field9",
            "field10",
        ];

        this.appointmentBookingAttributesList = [
            "appointment_booking_id",
            "total_booking_price",
            "order_status",
            "booked_current_date",
            "booked_current_time",
            "user_review_flag",
            "doctor_review_flag",  
        ];

        this.bookingStatusAttributesList = [
            "booking_status_id",
            "booking_status_name"
        ];
        this.UserAttributesList = [
            "user_id",
            "role_id",
            "name",
            "email",
            "user_number",
            "avatar"
        ];
        this.doctorUserAttributesList = [
            "doctor_id",
            "doctor_name",
            "doctor_email",
            "doctor_number",
            "avatar",
           
        ];
    }
}

module.exports = userFeedbackAttributesLists;