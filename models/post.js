const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [ // jak user polubi post to jego ID zostaje zapisane w tablicy, po to żeby nie mógł zrobić tego kolejny raz, jeśli dislike to jego ID zostaje usunięte z tablicy
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {  // data dla komentarzy
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {   // data dla postów
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);