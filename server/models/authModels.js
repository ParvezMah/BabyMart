import mongoose from "mongoose";

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
    addresss: [
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
        poastalCode: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // wishlist  -> will added later
    // cart  -> will added later
    // order  -> will added later
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", userSchema);
export default User;

