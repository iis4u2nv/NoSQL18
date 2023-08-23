const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trimmed: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // match: /^([\w-\.]+@[\w-]+\.[a-z]{2,6})$/,
      max_length: 50
    },
    //  Array of `_id` values referencing the `Thought` model

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought"
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
  },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    }
);
// friendSchema
//   .virtual('friendCount')
//   // Getter
//   .get(function () {
//     return this.friends.length;
//   });
const User = model('user', userSchema);

module.exports = User;
