const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { use } = require("../routes/user");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPassword',async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error('User not found');
    const hashedPassword= user.password;
    const salt=user.salt;
    const userProvidedHash=createHmac('sha256',salt)
    .update(password)
    .digest('hex');

    if(hashedPassword===userProvidedHash){
        return user;
    }else{
        throw new Error('Password does not match');
    }

})

const User = mongoose.model("User", userSchema);

module.exports = User;
