const mongoose = require("mongoose")

const UsersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    transactions: {
      added: [
          {
              account_id: String,
              account_owner: String,
              amount: Number,
              category: [String],  // Array of strings to store categories like ["Travel", "Taxi"]
              date: String,
              name: String,
              transaction_id: String,
          }
      ],
      modified: [
          {
              account_id: String,
              account_owner: String,
              amount: Number,
              category: [String],  // Array of strings to store categories like ["Travel", "Taxi"]
              date: String,
              name: String,
              transaction_id: String,
          }
      ],
      removed: [
          {
              account_id: String,
              account_owner: String,
              amount: Number,
              category: [String],  // Array of strings to store categories like ["Travel", "Taxi"]
              date: String,
              name: String,
              transaction_id: String,
          }
      ],
  }
})

const UserModel = mongoose.model("User", UsersSchema)
module.exports = UserModel