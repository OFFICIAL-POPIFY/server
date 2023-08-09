const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model("User", UserSchema);