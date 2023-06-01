const { ObjectId } = require('mongoose');
const { User, Thought} = require('../models');

const headCount = async () => {
  User.aggregate().count('userCount')
  .then((numberOfUsers) => numberOfUsers);
}

module.exports = {
    // Get all users
    getUsers(req, res) {
      User.find()
        .then(async (users) => {
          const userObj = {
            users,
            headCount: await headCount()
          }
          return res.json(userObj);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        })
    },
    // Gets a single user
    getSingleUser(req, res) {
      User.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
        .then(async (user) => 
          !user
            ? res.status(404).json({message: 'No user with that ID'})
            : res.json(user.username)
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
    // create a new student
    createUser(req, res) {
      User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
      // Update a user by ID
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json({
            updatedUser: user.username,
            message: 'user updated'
          })
      )
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json(
        { deletedUser: user, message: 'User and associated thoughts deleted!' }
      ))
      .catch((err) => res.status(500).json(err));
  },
  // Add a friend to a user
  addFriend(req, res) {
    console.log('You are adding a new friend');
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID :(' })
          : res.json({updatedUser: user, message: 'Friend added'})
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove a friend from a user
  removeFriend(req, res) {
    Student.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId  } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No student found with that ID :(' })
          : res.json({updatedUser: user, message: 'Friend removed'})
      )
      .catch((err) => res.status(500).json(err));
  }
}