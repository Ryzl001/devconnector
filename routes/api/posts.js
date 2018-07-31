const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');


// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Posts Works'
}))

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 }) // sortowanie wg daty
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get posts
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});


// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check Validation
    if(!isValid) {
        // if any errors send 400 with errors object
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }) ,(req, res) =>{
    Profile.findOne({ user: req.user.id })
        .then(profle => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if(post.user.toString() !== req.user.id) { // sprawdzamy czy jest właścicielem tego posta
                        return res.status(401).json({ notauthorized: 'User not authorized' }) // status nieautoryzacji
                    }

                    // Delete
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});

// @route   POST api/posts/like/:id  - post id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }) ,(req, res) =>{
    Profile.findOne({ user: req.user.id })
        .then(profle => {
            Post.findById(req.params.id)
                .then(post => {
                    //
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) { // true jeśli już został polajkowany przez tego usera
                        return res.status(400).json({ alreadyliked: 'User already liked this post' });
                    }

                    // Add user id to likes array
                    post.likes.unshift({ user: req.user.id });

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});

// @route   POST api/posts/unlike/:id  - post id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }) ,(req, res) =>{
    Profile.findOne({ user: req.user.id })
        .then(profle => {
            Post.findById(req.params.id)
                .then(post => {
                    //
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) { // równe zero znaczy, że go tam nie ma
                        return res.status(400).json({ notliked: 'You have not yet liked this post' });
                    }

                    // Get remove index
                    const removeIndex = post.likes
                        .map(like => like.user.toString())  // zamieniamy na Stringa żeby potem znaleźć / porównać z id usera
                        .indexOf(req.user.id);  // obecny user

                    // Delete
                    post.likes.splice(removeIndex, 1);

                    // Save
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        })
});

// @route   POST api/posts/comment/:id  - post id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check Validation
    if(!isValid) {
        // if any errors send 400 with errors object
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            // Add to comments array
            post.comments.unshift(newComment);

            // Save
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            // Check to see if comment exists
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) { //jeśli true tzn, że komentarz, który chcemy usunać nie istnieje
                return res.status(404).json({ commentnotexists: 'Comment does not exist' });
            }

            // Get remove index
            const removeIndex = post.comments
                .map(comment => comment.id.toString())  // bez toString() też działa
                .indexOf(req.params.comment_id)

                // Remove
                post.comments.splice(removeIndex, 1);

                // Save
                post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
})




module.exports = router;