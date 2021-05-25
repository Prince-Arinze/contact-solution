import { create, all, get, remove, update } from '../controllers/contact';

import auth from '../middleware/auth';
/**
 * 
 * 
 */
module.exports = app => {
    
    app.route('/contact/all').get(all);
    /**
     * Create the remaining routes
     * get,
     * create,
     * delete,
     * update,
     * remove
     */
    app.route("/contact/all").get(auth, all);
    app.route("/contact/create").post(auth, create);
    app.route("/contact/:id").get(auth, get)
    app.route("/contact/delete/:id").delete(auth, remove);
    app.route("/contact/update").put(auth, update);
};
