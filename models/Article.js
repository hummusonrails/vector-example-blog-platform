const ottoman = require('../services/clients/couchbaseClient');
const { Schema, model, getModel } = require('ottoman');
const slugify = require('slugify');

const articleModel = ottoman.model('Article', {
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    tagList: {
        type: [{ type: String, ref: 'Tag' }],
        default: () => [],
    },
    author: {
        type: String,
        ref: 'User',
    },
    favoritesCount: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [{ type: String, ref: 'Comment' }],
        default: () => [],
    },
    embedding: {
        type: [Number],
    },
}, {
    timestamps: true,
});

// TODO: Implement uniqueValidator
// articleModel.plugin(uniqueValidator);
articleModel.pre('update', function(document){
    document.slug = slugify(document.title, { lower: true, replacement: '-'});
});

// user is the logged-in user
articleModel.methods.toArticleResponse = async function (user) {
    const User = getModel('User');
    const authorObj = await User.findById(this.author);
    return {
        slug: this.slug,
        articleSlug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? user.isFavorite(this.id) : false,
        favoritesCount: this.favoritesCount,
        author:  authorObj.toProfileJSON(user)
    }
}

articleModel.methods.addComment = async function (commentId) {
    if(this.comments.indexOf(commentId) === -1){
        this.comments.push(commentId);
    }
    return this.save();
};

articleModel.methods.removeComment = async function (commentId) {
    const idx = this.comments.indexOf(commentId);
    if(idx!== -1){
        this.comments.splice(idx, 1);
    }

    return this.save();
};

const scope = process.env.DB_SCOPE || "_default";
const article =  model('Article', articleModel, { scopeName: scope });
exports.articleModel = articleModel;
exports.Article = article;
