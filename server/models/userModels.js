import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_incoming&w=740&q=80",
    },
    role: {
      type: String,
      enum: ["admin", "user", "deliveryman"],
      default: "user",
    },
    addresses: [
      {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    wishlist: [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min:1,
        }
      }
    ]
    // order  -> will added later
  },
  {
    timestamps: true,
  },
);




// Match user entered passoword to hased password in database
userSchema.methods.matchPassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

// Encrypt password using bcrypt
userSchema.pre("save", async function (next){
  if(!this.isModified("password")){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Ensure Default Address
userSchema.pre("save", async function (next){
  if(this.isModified("addresses")){
    const defaultAddress = this.addresses.find((addr=> addr.isDefault));

    if(defaultAddress){
      this.addresses.forEach((addr)=> {
        if(addr !== defaultAddress) addr.isDefault = false;
      })
    }
  }
  next();
});



const User = mongoose.model("User", userSchema);
export default User;

