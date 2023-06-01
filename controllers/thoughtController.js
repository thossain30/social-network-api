const { ObjectId } = require('mongoose');
const { User, Thought} = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(async (thoughts) => {
                return res.json(thoughts);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
     },
    //  Get single thought by ID
     getSingleThought(req, res) {
        Thought.findOne({_id: req.params.thoughtId})
        .select('-__v')
        .then(async (thought) => 
          !thought
            ? res.status(404).json({message: 'No thought with this ID found'})
            : res.json(thought.thoughtText)
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
     },
    //  Post/create a new thought
     createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: thought._id} },
                { new: true }
            );
        })
        .then((user) => 
            !user
                ? res.status(404).json({message: "Thought created but no user with this id found"})
                : res.json({updatedUser: user, message: "Thought added to user"})
        )
        .catch((err) => res.status(500).json(err));
     },
    //  Put/update a new thought by it's _id
     updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with this id!' })
                : res.json({updatedThought: thought, message: 'thought updated'})
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
     }
}