const { model, registerGlobalPlugin, getDefaultInstance, Ottoman } = require('ottoman');
const { userSchema } = require('../models/User');
const { articleSchema } = require('../models/Article');
const { commentSchema } = require('../models/Comment');
const { Logger } = require('../config/logger');
const log = Logger.child({
  namespace: 'DBConnect',
});

const User = model('User', userSchema); 
const Comment = model('Comment', commentSchema); 
const Article = model('Article', articleSchema);

const setupOttoman = async function () {
  // TODO: Fix global plugin registration
  await registerGlobalPlugin((schema) => {
    schema.pre('save', function (doc) {
      console.log("SAAAAAVE");
    });
  });

  let ottoman = getDefaultInstance();
  if (!ottoman) {
    ottoman = new Ottoman({ ensureIndexes: true });
  }

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
    throw e;
  }

  try {
    await ottoman.ensureIndexes();
    console.log("Indexes ensured successfully");
  } catch (indexError) {
    log.error("Error ensuring indexes:", indexError);
    throw indexError;
  }

  await ottoman.start();
  console.log('Connected to Couchbase');
};

module.exports = { setupOttoman, User, Comment, Article };
