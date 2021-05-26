import app from '../server';
import User from '../entities/user';
import Contact from '../entities/contact';
import chai from 'chai';
import chaiHttp from 'chai-http';




// Assertion Style

const { expect } = chai

chai.use(chaiHttp);

let user;
let newUser;
let contact;
let access_token;
let refresh_token;
let createContacts;

describe("Unit tests for User and Contacts Apis endpoint", () =>{
   
    before(done => {
            user = { name: "Cypher", username: "cyphernation", password: "12345678", email: "test@test.com"};
            User.deleteMany().exec();
            Contact.deleteMany().exec();

            done();
      })
      after(done => {
        User.deleteMany();
        Contact.deleteMany()
        done();
      });

    //   Test the signup
    describe("POST /auth/signup", () => {
        it("It should create a new user", (done) => {
            chai.request(app)
            .post("/auth/signup")
            .send(user)
            .end((err, response) => {
                const body  = response.body.user;
                newUser = body;
                expect(200)
                expect(body).to.contain.property("_id")
                expect(body).to.contain.property("name")
                expect(body).to.contain.property("username")
                expect(body).to.contain.property("email")
                expect(body).to.contain.property("password")
                done();
                
            })
        })
    });
    
    // Test the login

    describe("POST /auth/login", () => {
        it("It should login existing user", (done) => {
            const data = { username: "cyphernation", password: "12345678" }
            chai.request(app)
            .post("/auth/login")
            .send(data)
            .end((err, response) => {
                 access_token = response.body.access_token;
                 refresh_token = response.body.refresh_token
                 const { body } = response;
                 expect(200)
                expect(body).to.contain.property("access_token")
                expect(body).to.contain.property("refresh_token")
                expect(body).to.contain.property("user")
                done();
                
            })
        })
    });

       // Test the forgotten password
        describe("POST /auth/forgotPassord", () => {
            it("It should send a password reset link to the user email", (done) => {
                const data = { email: newUser.email }
                chai.request(app)
                .post("/auth/forgotPassword")
                .send(data)
                .end((err, response) => {
                     const { body } = response;
                    expect(body).to.contain.property("msg");
                    expect(body.msg).to.equal("Email sent!");
                    done();      
                })
            })
        });

    // Test for failure to create contact due to unauthorized access;
  describe("POST /contact/create", () => {
    it("It should throw an Access denied error", (done) => {
        contact = { creator: newUser._id, firstName: "Prince", lastName: "Ndu", mobile: "08138602173",  address: "Canada", email: "prince@gmail.com" };
        chai.request(app)
        .post("/contact/create")
        .send(contact)
        .end((err, response) => {
            const { body } = response;
            expect(body.err).to.equal("Access denied.");
            done();
            
        })
    })
  });

// Create new contact for an authorized user;
  describe("POST /contact/create", () => {
    it("It should create a new contact", (done) => {
        contact = { creator: newUser._id, firstName: "Prince", lastName: "Ndu", mobile: "08138602173",  address: "Canada", email: "prince@gmail.com" };
        chai.request(app)
        .post("/contact/create")
        .set("authorization", access_token)
        .send(contact)
        .end((err, response) => {
            const { body: { newContacts } } = response;
            createContacts = newContacts;
            expect(200);
            expect(createContacts).to.contain.property("firstName");
            expect(createContacts).to.contain.property("lastName");
            expect(createContacts).to.contain.property("mobile");
            expect(createContacts).to.contain.property("address");
            expect(createContacts).to.contain.property("email");
            done();
            
        })
    })
  });


   // Test for failure to fetch a contact due to unauthorized access

    describe("GET /contact/:id", () => {
        it("It should throw an access denied error", (done) => {
            const { _id } = createContacts
            chai.request(app)
            .get(`/contact/${_id}`)
            .end((err, response) => {        
                const { body } = response;
                expect(200);
                expect(body.err).to.equal("Access denied.");
                done();
                
            })
        })
    });

  
    // Get a single contact using the id as the params only if you are authorized
    describe("GET /contact/:id", () => {
        it("It should get a single contact", (done) => {
            const { _id } = createContacts
            chai.request(app)
            .get(`/contact/${_id}`)
            .set("authorization", access_token)
            .end((err, response) => {        
                const body = response.body;
                expect(200);
                expect(body).to.be.instanceOf(Object);
                expect(body._id).to.equal(_id);
                done();
                
            })
        })
    });

    
   // Test for failure to fetch all contact due to unauthorized access

   describe("GET /contact/all", () => {
        it("It should throw an access denied error", (done) => {
            chai.request(app)
            .get(`/contact/all`)
            .end((err, response) => {        
                const { body } = response;  
                expect(200);
                expect(body.err).to.equal("Access denied.");
                done();
                
            })
        })
   });

    // Get all contact if you are authorized;
    describe("GET /contact/all", () => {
        it("It should get all contacts", (done) => {
            chai.request(app)
            .get("/contact/all")
            .set("authorization", access_token)
            .end((err, response) => {
                const { body: {  allContacts } } = response;  
                expect(200);
                expect(allContacts).to.be.instanceOf(Object)
                done();
                
            })
        })
  });

  // Test for updating a contact

  describe("PUT /contact/update", () => {
    it("It should update an existing contact", (done) => {
        const newMobile = "07066695655";
        const id = createContacts._id;
        const data = { id, mobile: newMobile };
        chai.request(app)
        .put("/contact/update")
        .set("authorization", access_token)
        .send(data)
        .end((err, response) => {
            const { body } = response;  
            expect(200);
            expect(body).to.be.instanceOf(Object);
            expect(body).to.contain.property("mobile");
            expect(body.mobile).to.equals(newMobile);
            done();
            
        })
    })
  });

  
  // Test for deleting a contact

  describe("DELETE /contact/delete/:id", () => {
    it("It should delete a contact", (done) => {
        const id = createContacts._id;
        chai.request(app)
        .delete(`/contact/delete/${id}`)
        .set("authorization", access_token)
        .end((err, response) => {
            const { body } = response;  
            expect(200);
            expect(body).to.contain.property("msg");
            expect(body.msg).to.equal("Contact has been deleted");
            done();
            
        })
    })
  });

})