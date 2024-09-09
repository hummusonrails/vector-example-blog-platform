const {model, registerGlobalPlugin, getDefaultInstance, Ottoman } = require('ottoman');
const {userSchema, User} = require('../models/User');
const {articleSchema, Article} = require('../models/Article');
const {commentSchema, Comment} = require('../models/Comment');
const  {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'DBConnect',
});

const setupOttoman = async function(){

  // TODO: Fix global plugin registration
    await registerGlobalPlugin((schema) => {
        schema.pre('save', function (doc) {
          console.log("SAAAAAVE");
        });
      });

    let ottoman = getDefaultInstance();
    if (!ottoman) {
      // if not exist default one, then create
      ottoman = new Ottoman({ensureIndexes: true});
    };
  
    const endpoint = process.env.DB_ENDPOINT || "couchbase://localhost";
    const username = process.env.DB_USERNAME || "Administrator";
    const password = process.env.DB_PASSWORD || "password";
    const bucket = process.env.DB_BUCKET || "default";
    const scope = process.env.DB_SCOPE || "_default";

    try {
      await ottoman.connect({
        connectionString: endpoint,
        username: username,
        password: password,
        bucketName: bucket,
      });
    } catch (e) {
      throw(e);
    }

    const User = model('User', userSchema, { scopeName: scope });
    const Comment = model('Comment', commentSchema, { scopeName: scope });
    const Article = model('Article', articleSchema, { scopeName: scope });

    await ottoman.start();
    console.log('Connected to Couchbase');
}

module.exports = {setupOttoman, User, Comment, Article}
