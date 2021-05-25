import mongoose, { Schema, model } from 'mongoose';


export const ContactSchema = new Schema(
    {
        firstName: { type: String, required: true},
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true},
        mobile : { type: String, unique: true, required: true},
        address: { type: String,  required: true},
        creator: { type: Schema.Types.ObjectId, ref: "User", required: true},
    },
    { timestamps: true },
    { collection: 'contacts' }
)

const Contact =  model('Contact', ContactSchema);
export default Contact;
