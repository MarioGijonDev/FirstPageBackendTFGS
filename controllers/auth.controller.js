
// IMPORTS
// Import user model
import { User } from '../models/User.js'
// Import json web token
import jwt from 'jsonwebtoken'

// Register for register auth
export const register = async (req, res) => {

  // Get email and password from body
  const { name, surname, email, password } = req.body;

  try{

    // Create user with model
    const user = new User({name, surname, email, password});

    // Save user un database
    await user.save();

    return res.json({action: 'Register', request: req.body}); 

  }catch(e){

    // If error is equal to 1100, it means the email already exists
    if(e.code === 11000)
      return res.status(400).json({ error: 'Email already exists' })

    // Return server error
    return res.status(500).json({ error: 'Something went wrong in server' })

  }
};

// Logic for login auth
export const login = async (req, res) => {

  // Get email and password of request
  const { email, password } = req.body;

  try{

    // Chek if user exists
    let user = await User.findOne({ email });

    // If not existes, reply a json with the message
    if(!user)
      return res.status(403).json({ error: 'User does not exists' })

    // Check if password matches with database
    const passwordResponse = await user.comparePassword(password);

    // If passwords dont matches, reply a json with message
    if(!passwordResponse)
      return res.status(403).json({ error: 'Incorrect credentials' });

    // Generate jwt
    const token = jwt.sign({uid: user.id}, process.env.JWT_SECRET);

    // Return message with action
    return res.status(200).json({action: 'Login', request: req.body, jwt: token}); 

  }catch(e){

    // Return server error
    return res.status(500).json({ error: 'Something went wrong in server' })

  }
}