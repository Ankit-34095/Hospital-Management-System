const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();


mongoose.connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));

app.get('/patientlogin', async function(req,res){
    let name = req.query['username'];
    let password = req.query['password'];
    console.log(password);
    console.log(name);
    const user = await User.findOne({ username: name });

          if (user) {
              const result = (password === user.password);
              if (result) {
                res.redirect('/patienthome.html');
              } 
              else{
                res.send('Invalid Password');
                // res.redirect('/patientinvalidpassword.html');
              }
          }    
          else{
            res.send('Invalid User');
            // req.redirect('/patientinvaliduser.html');
          }
});

app.get('/patientsignup', async function(req,res){
  console.log("hello" )
  let name = req.query['name'];
  let email = req.query['email'];
  let username = req.query['username'];
  let password = req.query['password'];
  // console.log(password);
  console.log(name);
});


// app.get('/DoctorLogin', async function(req,res){
//   let name = req.query['username']
//   let password = req.query['password']
//   console.log(password);
//   console.log(name);
//   const user = await User.findOne({ username: name });

//         if (user) {
//             const result = (password === user.password);
//             if (result) {
//               res.redirect('/doctorhome.html');
//             } 
//             else{
//               res.send("Invalid password");
//               res.redirect('/doctorinvalidpassword.html');
//             }
//         }    
//         else{
//           res.send("Invalid User");
//           res.redirect('/doctorinvaliduser.html');
//         }
// });
// app.get('/patientinvaliduser', async function(req,res){
//     let name = req.query['username']
//     let password = req.query['password']
//     console.log(password);
//     console.log(name);
//     const user = await User.findOne({ username: name });

//           if (user) {
//               const result = (password === user.password);
//               if (result) {
//                 res.redirect('/patienthome.html');
//               } 
//               else{
//                 res.redirect('/patientinvalidpassword.html');
//               }
//           }   
//           else{
//             req.redirect('/patientinvaliduser.html');
//           }
// });

// app.get('/patientinvalidpassword', async function(req,res){
//     let name = req.query['username']
//     let password = req.query['password']
//     console.log(password);
//     console.log(name);
//     const user = await User.findOne({ username: name });

//           if (user) {
//               const result = (password === user.password);
//               if (result) {
//                 res.redirect('/patienthome.html');
//               } 
//               else{
//                 res.redirect('/patientinvalidpassword.html');
//               }
//           }    
//           else{
//             req.redirect('/patientinvaliduser.html');
//           }
// });

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});