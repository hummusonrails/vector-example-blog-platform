const { Schema, model, getModel } = require('ottoman');

const commentSchema = new Schema({
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

commentSchema.methods.toCommentResponse = async function (user) {
    let authorObj = await getModel('User').findById(this.author);
    return {
        id: this.id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: authorObj.toProfileJSON(user)
    };
};

const scope = process.env.DB_SCOPE || "_default";
const Comment = model('Comment', commentSchema, { scopeName: scope });
module.exports = {
    Comment,
    commentSchema
};