# Contact/Address Book (Rest Backend) Concept - Assessment

---

- Pull the assessment repo
  - > `git clone https://github.com/Prince-Arinze/contact-solution.git`
- Pull up your favorite console and change to this directory
- Install the projects dependencies

  - > `npm install`

- Set up the environmental variables

---

- Do this to declare the environmental variables
- Create a `.env` file in the root directory of the project and add the following environment variable
- To add Database URI connection string (local URI string or cloud database URI string)
  - > `DEV_DB = mongodb://localhost:27017/contact` and `TEST_DB = mongodb://localhost:27017/test-contact`
- To add secret key for jsonwebtoken token to `.env` file
- This api stores two types of tokens: access_token and refresh_token
- To add both tokens secret keys to the `.env` file do this
  - > `ACCESS_TOKEN_SECRET=yoursecretaccessTOKENkey` and this `REFRESH_TOKEN_SECRET=yoursecretrefreshtokenkey`
- To add nodemailer sender password and sender email for `FORGOT PASSWORD` emailing to `.env` file

  - > `MAILER_EMAIL=add_your_gmail_sender_email`
  - > `MAILER_PASSWORD=add_your_gmail_sender`
    - > If you don't have gmail account please do well to create one since the service used is gmail

- To set development or test environment mode in the `.env` file
  - > `NODE_ENV=development` for development mode or `NODE_ENV=test` for test mode

## Start Development

- To build the project
  - > `npm run build`
- To continuously watch for changes
  - > `npm run watch`
- To run your app server
  - > `npm run start`
- To test your app
  - > `npm run test`

## Start Test

- Change `NODE_ENV` from development to test mode in the `.env` file to connect to the TEST mongodb database
  - > `NODE_ENV=test`
- To build the project
  - > `npm run build`
- To continuously watch for changes
  - > `npm run watch`
- To run test
  - > `npm run test`
