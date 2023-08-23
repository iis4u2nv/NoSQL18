const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

// Aggregate function to get the number of users overall
module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      
      const userObj = {
        users,
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' })
      }

      res.json({
        user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      console.log(req.body)
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
  async updateUser( req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {$set:req.body},
        {runValidators: true, new: true} 
      )
      res.json(user);
    }
    catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a user and remove them from the thought
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
      }

      const thoughtText = await Thought.findOneAndUpdate(
        { users: req.params.userId },
        { $pull: { users: req.params.userId } },
        { new: true }
      );

      if (!thoughtText) {
        return res.status(404).json({
          message: 'User deleted, but no thought texts found',
        });
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(200).json({ message: 'User successfully deleted' });
    }
  },

  // Add a friend to a user
  async addFriend(req, res) {
   
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeFriend(req, res) {
   
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID :(' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
