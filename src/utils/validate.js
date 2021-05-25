const validateUser = (email, username, password, name) => {
    if(!email || !username || !password || !name)
     return "Please fill all fields";

     if(!validateEmail(email))
     return "Invalid email";

     if(!validatePassword(password))
     return "Password must be at least 8 characters";
}

const validateContact = (firstName, lastName, email, mobile, address)  => {
    if(!firstName || !lastName || !email || !mobile || !address) return "All fields must not be empty";

    if(!validateMobile(mobile)) return "Mobile number should be 10 digits when not started with zero or 11 digits when starting with zero";
    
    if(!validateEmail) return "Invalid email"
}

function validateEmail(email){
   const reg = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?(\.[a-z]{2,8})?$/
   return reg.test(email)
};

function validatePassword(password){
    const reg = /^[\w@-]{8,20}$/
    return reg.test(password)
}


function validateMobile(mobile){
    const reg = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g;
    return reg.test(mobile)
}

export { validateUser, validateContact }

