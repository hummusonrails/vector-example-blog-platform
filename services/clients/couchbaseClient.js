const ottoman = require('ottoman');

const {
  DB_ENDPOINT,
  DB_BUCKET,
  DB_USERNAME,
  DB_PASSWORD,
} = process.env;

const connectToCouchbase = async () => {
  await ottoman.connect({
    connectionString: DB_ENDPOINT,
    bucketName: DB_BUCKET,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    configProfile: 'wanDevelopment',
  });

  await ottoman.start();
};

connectToCouchbase().catch(console.error);

module.exports = ottoman;
