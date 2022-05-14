const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true,minlength:6 },
    picture: {
      type: String,
      required: true,
      default:
        "https://play-lh.googleusercontent.com/j-6MazQzqjj9YzbQbSqS13FzRLcUA8ZxZTZLdd79yY4gfYlogVn9Sq_orVRXUeMKvg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {  versionKey:false,
    timestaps: true }
);

userSchema.pre("save",function(next){
  const hashPassword = bcrypt.hashSync(this.password,8)
  this.password=hashPassword;
  next();
})

userSchema.methods.checkPassword = function(password){
  return bcrypt.compareSync(password,this.password);
}

// *************OTHER WAY TO HASH PASSWORD ***************************
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
