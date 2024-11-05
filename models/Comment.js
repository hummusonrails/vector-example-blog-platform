const ottoman = require('../services/clients/couchbaseClient');
const { Schema, model, getModel } = require('ottoman');

const commentModel = ottoman.model('Comment', {
    body: {
        type: String,
        required: true,
    },
    article: {
        type: String,
        ref: 'Article',
    },
    author: {
        type: String,
        ref: 'User',
    },
}, {
    timestamps: true,
});


commentModel.methods.toCommentResponse = async function (user) {
    let authorObj = await getModel('User').findById(this.author);
    return {
        id: this.id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: authorObj.toProfileJSON(user)
    }
};

const scope = process.env.DB_SCOPE || "_default";
module.exports = { 
    Comment: model(
        'Comment', commentModel, { scopeName: scope }
    ), 
    commentModel: commentModel
};