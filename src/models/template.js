const mongoose = require('mongoose');
const { Schema } = mongoose;

const templateSchema = new Schema({

    id: { type: String, required: true }, // UUID from Interakt
    name: { type: String, required: true },
    display_name: { type: String },
    language: { type: String, required: true },
    category: { type: String },
    sub_category: { type: String, default: null },
    template_category_label: { type: String, default: null },

    header_format: { type: String }, // e.g., "TEXT"
    header: { type: String },
    header_handle: { type: String, default: null },
    header_handle_file_url: { type: String, default: null },
    header_handle_file_name: { type: String, default: null },
    header_text: [{ type: String }], // stored as array of strings

    body: { type: String },
    body_text: [{ type: String }], // stored as array of strings

    footer: { type: String },

    buttons: {
        type: String, // JSON string, you can convert to object if needed
    },
    button_text: { type: String }, // also appears to be a JSON string

    allow_category_change: { type: Boolean },
    limited_time_offer: { type: String, default: null },
    autosubmitted_for: { type: String, default: null },

    created_at_utc: { type: Date },
    modified_at_utc: { type: Date },
    created_by_user_id: { type: String, default: null },
    organization_id: { type: String },

    approval_status: { type: String }, // e.g., "WAITING"
    wa_template_id: { type: String },

    is_archived: { type: Boolean },
    channel_type: { type: String }, // e.g., "Whatsapp"
    is_click_tracking_enabled: { type: Boolean },
    allow_delete: { type: Boolean },
    rejection_reason: { type: String, default: null },
},
    { timestamps: true }
);

module.exports = mongoose.model('InteraktTemplate', templateSchema);
