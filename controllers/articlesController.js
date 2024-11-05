const asyncHandler = require('express-async-handler');
const {getModel} = require('ottoman');
const User = getModel('User');
const Article = getModel('Article');
const  {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'articlesController',
});

const createArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const author = await User.findById(id).catch(e => {log.debug(e, "User not found"); return res.status(401).json({message: "User not found"}); });

    const { title, description, body, tagList } = req.body.article;

    // confirm data
    if (!title || !description || !body) {
        return res.status(400).json({message: "All fields are required"});
    }

    const article = await Article.create({ title, description, body });

    article.author = id;

    if (Array.isArray(tagList) && tagList.length > 0) {
        const localeSort = Array.from(tagList).sort((a, b) => {
            return a.localeCompare(b);
          });
        article.tagList = localeSort;
    }

    await article.save()

    return res.status(200).json({
        article: await article.toArticleResponse(author)
    })

});

const deleteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const { slug } = req.params;

    log.debug(`userid: ${id}`);

    const loginUser = await User.findById(id).catch(e => log.debug(e, "User not found"));

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const article = await Article.findOne({slug}).catch(e => log.debug(e, "Article not found"));

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }
    log.debug(`article author is ${article.author}`)
    log.debug(`login user id is ${loginUser}`)

    if (article.author.toString() === loginUser.id.toString()) {
        await Article.removeById(article.id);
        res.status(200).json({
            message: "Article successfully deleted!!!"
        })
    } else {
        res.status(403).json({
            message: "Only the author can delete his article"
        })
    }

});

const favoriteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const { slug } = req.params;

    const loginUser = await User.findById(id).catch(e => log.debug(e, "User not found"));

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const article = await Article.findOne({slug}).catch(e => log.debug(e, "Article not found"));

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }
    log.debug(`article info ${article}`);

    const updatedArticle = await loginUser.favorite(article.id);

    return res.status(200).json({
        article: await updatedArticle.toArticleResponse(loginUser)
    });
});

const unfavoriteArticle = asyncHandler(async (req, res) => {
    const id = req.userId;

    const { slug } = req.params;

    const loginUser = await User.findById(id).catch(e => log.debug(e, "User not found"));

    if (!loginUser) {
        return res.status(401).json({
            message: "User Not Found"
        });
    }

    const article = await Article.findOne({slug}).catch(e => log.debug(e, "Article not found"));

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    const updatedArticle = await loginUser.unfavorite(article.id);

    return res.status(200).json({
        article: await updatedArticle.toArticleResponse(loginUser)
    });
});

const getArticleWithSlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const article = await Article.findOne({slug}).catch(e => log.debug(e, "Article not found"));

    if (!article) {
        return res.status(401).json({
            message: "Article Not Found"
        });
    }

    return res.status(200).json({
        article: await article.toArticleResponse(false)
    })
});

const updateArticle = asyncHandler(async (req, res) => {
    const  userId  = req.userId;

    const { article } = req.body;

    const { slug } = req.params;

    const loginUser = await User.findById(userId);

    const target = await Article.findOne({ slug });

    log.debug(target.title);
    log.debug(req.userId);
    if (article.title) {
        target.title = article.title;
    }
    if (article.description) {
        target.description = article.description;
    }
    if (article.body) {
        target.body = article.body;
    }
    if (article.tagList) {
        target.tagList = article.tagList;
    }

    await target.save();
    const articleResponse = await target.toArticleResponse(loginUser)
    return res.status(200).json({
        article: articleResponse
    })
});

const feedArticles = asyncHandler(async (req, res) => {
    let limit = 20;
    let offset = 0;

    if (req.query.limit) {
        limit = req.query.limit;
    }

    if (req.query.offset) {
        offset = req.query.offset;
    }

    const userId = req.userId;

    const loginUser = await User.findById(userId);

    log.debug(loginUser.followingUsers)

    // confirm data

    const {rows : filteredArticles} = await Article.find({author: {$in:  loginUser.followingUsers}}, {
        limit: Number(limit),
         skip: Number(offset)
    });

    log.debug(`articles: ${filteredArticles}`);
    const articleCount = await Article.count({author: {$in: loginUser.followingUsers}});

    const fetchedArticles = await Promise.all(filteredArticles.map(async article => {
        return await article.toArticleResponse(loginUser);
    }));
    return res.status(200).json({
        articles: fetchedArticles,
        articlesCount: articleCount
    });
});

const listArticles = asyncHandler(async (req, res) => {
    let limit = 20;
    let offset = 0;
    let query = {};
    if (req.query.limit) {
        limit = req.query.limit;
    }

    if (req.query.offset) {
        offset = req.query.offset;
    }
    if (req.query.tag) {
        query[`"${req.query.tag}"`] = { $in: { $field: 'tagList' } }
        // query.tagList = { $in: [req.query.tag] } // Works with
    }

    if (req.query.author) {
        const author = await User.findOne({username: req.query.author}).catch(e => log.debug(e, "User not Found"));
        if (author) {
            query.author = author.id;
        }
    }

    if (req.query.favorited) {
        const favoriter = await User.findOne({username: req.query.favorited}).catch(e => log.debug(e, "User not Found"))
        if (favoriter) {
            query.id = {$in: favoriter.favoritedArticles}
        }
    }
    const {rows : filteredArticles} = await Article.find(query,{limit: Number(limit), skip: Number(offset), sort: {createdAt: 'DESC'}  });
    const articleCount = await Article.count(query);

    if (req.loggedin) {
        const loginUser = await User.findById(req.userId);
        const fetchedArticles = await Promise.all(filteredArticles.map(async article => {
            return await article.toArticleResponse(loginUser);
        }));
        return res.status(200).json({
            articles: fetchedArticles,
            articlesCount: articleCount
        });
    } else {
        const fetchedArticles = await Promise.all(filteredArticles.map(async article => {
            return await article.toArticleResponse(false);
        }))
        return res.status(200).json({
            articles: fetchedArticles,
            articlesCount: articleCount
        });
    }
});

module.exports = {
    createArticle,
    deleteArticle,
    favoriteArticle,
    unfavoriteArticle,
    getArticleWithSlug,
    updateArticle,
    feedArticles,
    listArticles
}
