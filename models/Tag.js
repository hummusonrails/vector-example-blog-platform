const ottoman = require('../services/clients/couchbaseClient');
const { Schema, model, getModel } = require('ottoman');

const tagModel = ottoman.model('Tag', {
    tagName: {
        type: String,
        required: true,
        unique: true,
    },
    articles: {
        type: [{ type: String, ref: 'Article' }],
        default: () => [],
    },
}, {
    timestamps: true,
});

tagModel.methods.toTagResponse = function() {
    return {
        tagName: this.tagName,
        articles: this.articles
    }
}

const scope = process.env.DB_SCOPE || "_default";
module.exports = { 
    Tag: model('Tag', tagModel, { scopeName: scope }), tagModel: tagModel
};