const express = require("express")

const User = require('../models/usersModel')
// const router = new express.Router();

//Create a USER Route- POST request 
// router.post('/submitForm', async (req, res) => {
//     try {
//         console.log(req.body);
//         const newUser = new User(req.body);
//         await newUser.save();
        
//         // Send a success response or any additional logic here
//         res.status(201).send(newUser);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// Create User Route - POST request
const createNewUser = async (req, res) => {
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });

        if (existingUser) {
            throw new Error("Username or email already in use");
        }

        // Create a new user
        const newUser = new User(req.body);

        // Save the new user to the database
        await newUser.save();

        res.status(201).send(newUser);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};

// SEARCHING A USER BASED ON MULTIPLE CRITERIA
// const searchUser =  async (req, res) => {
//     try {
//         const { username, userProfile, email, phone } = req.body;

//         const findUser = await User.findOne({
//             $or: [
//                 { username },
//                 { userProfile },
//                 { email },
//                 { phone }
//             ]
//         });
//         if (!findUser) {
//             throw new Error("User not found")
//         }
//         console.log(findUser);
//         res.status(200).send(findUser);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };



// Read All USERS Route- GET request
const allUsers = async (req, res, next) => {
  try {
    let { page, size } = req.query;
    page = parseInt(page) || 1;
    size = parseInt(size) || 5;

    const limit = size;
    const skip = (page - 1) * size;
    const totalUsersCount = await User.countDocuments();
    const totalPages = Math.ceil(totalUsersCount / limit);
    const users = await User.find().limit(limit).skip(skip);

    res.status(200).json({
      users,
      page,
      size,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all users
// const allUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         console.log(users);
//         res.status(200).send(users)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// }
//Update USER  Route- PATCH request
// const updateUser = async(req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates=["username","userProfile","email","phone","password"]
//     const isValidOperation = updates.every((upData)=>allowedUpdates.includes(upData))
//     if(!isValidOperation){
//         return res.status(404).send("Invalid Update!")
//     }
//       try {
//         console.log(User);
//         console.log(req.params);
//         const id = req.params.id
//         const user = await User.findById(id);
//         console.log(user);
//        if(!user){
//         return res.status(404).send()
//        }
//         updates.forEach((update)=>user[update] = req.body[update])
//         await user.save()
//         res.status(200).send({ user});
  
//       } catch (error) {
//         res.send(error)
//       }
// }

// //Delete USER Route- DEL request
// const deleteUser =  async(req,res)=>{
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         console.log(req.params.id);
//         res.status(200).send(user)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// }

module.exports= {createNewUser, allUsers}