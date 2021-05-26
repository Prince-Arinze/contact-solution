import dotenv from "dotenv";
import Contact from "../entities/contact";

import { validateContact } from "../utils/validate";

/**
 * A simple CRUD controller for contacts
 * Create the necessary controller methods 
 */

dotenv.config()
// get all contacts
export const all = async (req, res) => {
    try {
        let allContacts = await Contact.find({}).populate("creator");
        if (!allContacts) return res.status(404).json({ error: "No contact records found" });
        return res.json({msg: "contacts found", allContacts});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// get a single contact
export const get = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "Id is not provided" });
        const contact = await Contact.findById({ _id: id }).populate("creator");
        if (!contact) return res.status(404).json({ error: "Contact not found!" });
        return res.json(contact);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// create a new contact
export const create = async (req, res)  => {
    try {  
        const { id } = req.user;

        const { firstName, lastName, email,  mobile, address  } = req.body;

        const errMsg = validateContact(firstName, lastName, email, mobile, address);
        if(errMsg) return res.status(400).json({ err: errMsg});
        const findMobile = await Contact.findOne({ mobile });
        if(findMobile) return res.status(400).json({err: "Contact already exists"})

         let newContacts = new Contact({
            firstName,
            lastName,
            email,
            mobile,
            address,
            creator: id
        });
        newContacts = await newContacts.save();
        if(!newContacts) return res.status(400).json({err: "Failed to save contact"});
        return res.json({msg: "Contact saved successfully", newContacts});  
    } catch (error) {
          return res.status(500).json({err: error.message})
    }
}

// updates a contact
export const update = async (req, res) => {
    try {

        const { id, firstName, lastName, email, mobile, address } = req.body;
        if (!id) return res.status(400).json({ err: "Invalid parameter: id" });

        let contact = await Contact.findById({ _id: id });
        if (!contact) return res.status(404).json({ err: "Contact not found" });

        if(firstName) contact.firstName = firstName;
        if(lastName) contact.lastName = lastName;
        if(email) contact.email = email;
        if (mobile) contact.mobile = mobile;
        if (address) contact.address = address;
     

        contact = await contact.save();
        return res.json(contact);

    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
}

// remove a contact
export const remove = async (req, res) => { 
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "Missing parameter: id" });

        const contact = await Contact.findByIdAndRemove({ _id: id });
        if (!contact) return res.status(404).json({ error: "Contact not found" });

        return res.json({ msg: "Contact has been deleted" });

    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
}

export default {
    // get all contacts for a user
    all,
    // get a single contact
    get,
    // // create a single contact
    create,
    // // update a single contact
    update,
    // // remove a single contact
    remove
}