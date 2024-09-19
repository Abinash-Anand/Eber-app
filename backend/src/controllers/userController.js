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
//   try {
//       console.log(req.params);
//         const { username, userProfile, email } = req.params;

//         const findUser = await User.findOne({
//             $or: [
//                 { username },
//                 { userProfile },
//                 { email },
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

const searchUser = async (req, res) => {
  try {
    const { filter, value } = req.query;

    // Initialize an empty query object
    let query = {};

    if (['userProfile', 'username', 'email', 'phone'].includes(filter)) {
      query[filter] = value;
    } else {
      return res.status(400).send({ message: 'Invalid search criteria.' });
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).send("User Not Found.");
    }

    res.status(200).send(user);

  } catch (error) {
    console.error('Error fetching specific user:', error);
    res.status(500).send({ message: 'Server Error' });
  }
};


// module.exports = { searchUser };



// Read All USERS Route- GET request
const allUsersSortedAndpaginated = async (req, res, next) => {
   try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const size = parseInt(req.query.size) || 5; // Default to 5 items per page
        const sortBy = req.query.sortBy || 'username'; // Default sorting by 'username'
        const sortOrder = req.query.sortOrder || 'asc'; // Default to ascending
        const sortDirection = sortOrder === 'desc' ? -1 : 1;

        console.log("Received Request Query:", req.query);
        console.log("Sort By:", sortBy, "Sort Order:", sortOrder);

        // Validate sort field
        const validSortFields = ['username', 'email', 'phone', 'userProfile', 'countryCode'];
        if (sortBy && !validSortFields.includes(sortBy)) {
            return res.status(400).json({ 
                error: 'Invalid sort column', 
                validFields: validSortFields // Provide a list of valid fields for better client-side handling
            });
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * size;

        // Dynamic query construction based on filters (if any)
        let query = {};
        if (req.query.isActive) { // Assuming you want to filter by 'isActive'
            query.isActive = req.query.isActive === 'true';
        }

        // Prepare sorting options
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortDirection;
        }

        // Query the database
        const totalDriversCount = await User.countDocuments(query);
        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(size)
            .lean(); // Improves performance by returning plain JS objects

        // Handle edge case where page is out of range
        const totalPages = Math.ceil(totalDriversCount / size);
        if (page > totalPages && totalPages > 0) {
            return res.status(404).json({ message: "Page not found" });
        }

        // Construct and send the response
        res.status(200).json({
          users,
          page,
          size,
          totalPages,
          totalDriversCount
        });

    } catch (error) {
        console.error('Error fetching drivers:', error);
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
//   const updates = Object.keys(req.body)
//   console.log(updates);
//     const allowedUpdates=["username","userProfile","email","phone"]
//     const isValidOperation = updates.every((upData)=>allowedUpdates.includes(upData))
//     if(!isValidOperation){
//       return res.status(404).send("Invalid Update!")
//     }
//     try {
//       console.log(User);
//       console.log(req.params);
//         const id = req.body.id
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

const updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, userProfile, username, email, phone, countryCode } = req.body;
    // console.log({userId, userProfile, username, email, phone, countryCode});
   const userToUpdate = await User.findOne({_id: userId} )
    if (!userToUpdate) {
      return res.status(404).send("user not found")
    }
    console.log('User: ', userToUpdate)
    userToUpdate.userProfile  = userProfile
    userToUpdate.username = username
    userToUpdate.email = email
    userToUpdate.phone = phone
    userToUpdate.countryCode = countryCode
    console.log(userToUpdate)
    await userToUpdate.save()
    res.status(202).send(userToUpdate);
  } catch (error) {
    res.status(500).send(error);
  }
};

// //Delete USER Route- DEL request
const deleteUser =  async(req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        console.log(req.params.id);
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
}


//==================sortedUserTable=============
// const sortedUserTable = async(req, res) => {
//   try {
//     // Extract query parameters
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const size = parseInt(req.query.size) || 5; // Default to 10 items per page
//     const sortBy = req.query.sortBy || 'username'; // Default sorting by username
//     const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default to ascending
//     console.log("SortBy: ", sortBy)
//       if (!['userProfile','username', 'email', 'phone', 'countryCode'].includes(sortBy)) {
//         return res.status(400).json({ error: 'Invalid sort column' });
//       }
//     // const limit = size;
//     const skip = (page - 1) * size;
//      // Query database with sorting and pagination
//     const users = await User.find()
//       .sort({ [sortBy]: sortOrder })
//       .skip(skip)
//       .limit(size);
//         // Count total users for pagination
//     const totalUsers = await User.countDocuments();

//     // Calculate total pages
//     const totalPages = Math.ceil(totalUsers / size);

//     // Send response
//     res.status(200).json({
//       users,
//       page,
//       size,
//       totalPages
//     });
//   } catch (error) {
//       console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal server error' });
  
//   }
// }

module.exports= {createNewUser,  updateUser, deleteUser, searchUser,allUsersSortedAndpaginated}