const ottoman = require('ottoman');

const connectToCouchbase = async () => {
    await ottoman.connect({
        connectionString: process.env.COUCHBASE_CONNECTION_STRING, 
        bucketName: 'default',
        username: process.env.COUCHBASE_USERNAME,
        password: process.env.COUCHBASE_PASSWORD,
    });

    await ottoman.start(); 
};

connectToCouchbase().catch(console.error);

module.exports = ottoman;

