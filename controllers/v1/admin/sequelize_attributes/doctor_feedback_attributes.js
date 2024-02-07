class doctorFeedbackAttributesLists {
    constructor() {
        this.doctorBookingFeedbackAttributesList = [
            "category",
            "sub_category",
            "specific_notes",
            "prescription_details"
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

module.exports = doctorFeedbackAttributesLists;