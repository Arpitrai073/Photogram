import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {type: String, default: ""},
    image: {type: String, required: false}, // Made optional for polls
    postType: {type: String, enum: ['image', 'poll'], default: 'image'},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    // Poll-specific fields
    pollQuestion: {type: String},
    pollOptions: [{
        text: {type: String},
        votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }],
    // Story-specific fields
    isStory: {type: Boolean, default: false},
    storyExpiresAt: {type: Date},
    // Analytics fields
    views: {type: Number, default: 0},
    shares: {type: Number, default: 0}
}, {timestamps: true});

export const Post = mongoose.model('Post', postSchema);