const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel")

const isValid = (value) => { //
    if (typeof value === "undefined" || value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  

const createUser = async(req , res) => {
try{   
    let  data = req.body
   
    if (Object.keys(data) == 0) {
        return res.status(400).send({ status: false, msg: " data is  missing" });
      }
    

   let { title , name, phone , email , password, address} = data // destructuring

 
   const reqTitle = isValid(title)
   //----------------------------------------------------------------------------------------titleValidation
   if (!isValid(title))  {
    res.status(400).send({ status: false, message: 'title is required' })
       return
    }

    // if ((data.title !== "Mr" || "Mrs" || "Miss") )  {
    //     res.status(400).send({ status: false, message: 'title abreviation is required' })
    //        return
    // }
    if((data.title)!=( 'Mr'|| 'Mrs' || 'Miss')) {
        return res.status(400).send({status: false, message: 'Title is not Valid'})
    }
   


    
    const reqName = isValid(name)
    //----------------------------------------------------------------------------------------nameValidation
    if (!isValid(name)) {
      res.status(400).send({ status: false, message: 'name is required' })
        return
    }

    //---------------------------------------------------------------------------------------phoneValidation
    const reqPhone = isValid(phone)
    if (!isValid(phone)) {
        res.status(400).send({ status: false, message: 'phone is required' })
          return
    }

    if (!(/^([+]\d{2})?\d{10}$/.test(data.phone))) {
        return res.status(400).send({ status: false, msg: "please provide a valid phone Number" })
    }

    let duplicateMobile  = await userModel.findOne({phone:data.phone})
    if(duplicateMobile){
        return res.status(400).send({ status:false, msg: 'Phone already exists'})
    }
    
    const reqMail = isValid(email)
    //---------------------------------------------------------------------------------------emailValidation
    if (!isValid(email)) {
        res.status(400).send({ status: false, message: 'Email is required' })
          return
    }
    
    if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))) {
        return res.status(400).send({ status: false, msg: "Please provide a valid email" })
    }

    let duplicateEmail  = await userModel.findOne({email:data.email})
    if(duplicateEmail){
        return res.status(400).send({ status:false, msg: 'email already exists'})
    }

    //--------------------------------------------------------------------------------------passwordValidation
    const reqPass = isValid(password)
    if (!isValid(password)) {
        res.status(400).send({ status: false, message: 'password is required' })
          return
    }

    if( !( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(data.password))) {
        return res.status(400).send({ status: false, msg: "Please provide a valid password" })
    }

    //  This regex will enforce these rules:

    // At least one upper case English letter, (?=.*?[A-Z])
    // At least one lower case English letter, (?=.*?[a-z])
    // At least one digit, (?=.*?[0-9])
    // At least one special character, (?=.*?[#?!@$%^&*-])
    // Minimum eight in length .{8,} (with the anchors)

//---------------------------------------------------------------------------------------------addressValidation
 
if (!isValid(address)) {
    res.status(400).send({ status: false, message: 'address is required' })
      return
}

// if (!isValid(data.)) {
//     res.status(400).send({ status: false, message: 'street is required' })
//       return
// }

// const a = data.address

// if(!(a))

//---------------------------------------------------------------------------------------------creatingUser

//const userData = { title , name, phone , email , password, address }

const newUser = await userModel.create(data)
 res.status(201).send({ status:true, data:newUser, msg: "user created successfully"})

}catch(err){
    res.status(500).send({status : false , msg : err.message})
} 
}

//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
const userLogin = async function (req, res) {
    try {
        const loginBody = req.body;
        if(!(loginBody)) {
            return res.status(400).send({status: false, message: 'Please provide login details'})

        }

        const {email, password} = loginBody;
        
        if(!isValid(email)) {
            return res.status(400).send({status: false, message: 'Email is required'})
        }
        
        if(!isValid(password)) {
            return res.status(400).send({status: false, message: 'Password is required'})
        }

        const checkEmail = await userModel.findOne({email: email});

        if(!checkEmail) {
            return res.status(401).send({status: false, message: 'Invalid Email'});
        }

        const checkPassword = await userModel.findOne({password: password})

        if(!checkPassword) {
            return res.status(401).send({status: false, message: 'Invalid Password'});
        }
        

        const token = jwt.sign({
            userId: checkEmail._id.toString(),
            // exp: Math.floor(Date.now()/1000) + 10 * 60 * 60
        },
            'my-secret',
            { expiresIn: '5m'}
            );
            res.setHeader("x-api-token", token)

        return res.status(200).send({status: true, message: 'User login successfull', data: {token}});
    } 
    catch (error) {
        return res.status(500).send({status: false, message: error.message});
    }
}





module.exports.createUser = createUser;
module.exports.userLogin = userLogin;