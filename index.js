const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
const port = 3010;
app.use(express.json());

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type:String, required: true}
});

const User = mongoose.model('User', userSchema);


app.post('/login', async(req,res) => {
  try{
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({message: 'Email and Password are required'});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({message: "Invalid credentials"});
    }

    res.status(200).json({ message: "Login Successful", user: {id: user._id, email: user.email}});
  } catch(error){
    res.status(500).json({message: 'Server error', error: error.message});
  }
});

mongoose.connect('mongodb+srv://iashishyadav17:test12@cluster0.8yz77i5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const PORT = port || 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
