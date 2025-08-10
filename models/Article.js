/**
 * Book-aligned note: For search result optimization, you may add recencyScore and popularityScore fields as follows:
 *
 * recencyScore: {
 *     type: Number,
 *     default: 0,
 * },
 * popularityScore: {
 *     type: Number,
 *     default: 0,
 * },
 *
 * These fields are discussed in the book's optimization chapters for ranking search results by freshness and popularity.
 */
const { Schema, model, getModel } = require('ottoman');
const slugify = require('slugify');

const articleSchema = new Schema({
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
    // Vector embedding for this article (used for vector search)
    embedding: {
        type: [Number],
        default: () => [],
    }
}, {
    timestamps: true,
});

// Pre-update hook to set slug from title
articleSchema.pre('update', function(document) {
    document.slug = slugify(document.title, { lower: true, replacement: '-' });
});

// user is the logged-in user
articleSchema.methods.toArticleResponse = async function (user) {
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
        author: authorObj.toProfileJSON(user)
    };
};

articleSchema.methods.addComment = async function (commentId) {
    if (this.comments.indexOf(commentId) === -1) {
        this.comments.push(commentId);
    }
    return this.save();
};

articleSchema.methods.removeComment = async function (commentId) {
    const idx = this.comments.indexOf(commentId);
    if (idx !== -1) {
        this.comments.splice(idx, 1);
    }
    return this.save();
};

const scope = process.env.DB_SCOPE || "_default";
const Article = model('Article', articleSchema, { scopeName: scope });
exports.articleSchema = articleSchema;
exports.Article = Article;
