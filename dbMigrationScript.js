const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
const scriptParams = require('minimist')(process.argv.slice(2));

// here is the mongo driver documentation https://mongodb.github.io/node-mongodb-native/4.3/modules.html

const backupPostfix = '_backup';

async function main() {
    initDotEnv();

    const sourceUrl = process.env.APP_DB_COPY_SOURCE || scriptParams.APP_DB_COPY_SOURCE;
    const targetUrl = process.env.APP_DB_HOST || scriptParams.APP_DB_HOST;
    let targetDbConnection, sourceDbConnection;

    if(!sourceUrl || !targetUrl) {
        console.error('Source or target URL do not set. Please set them with environments or params (APP_DB_TARGET, APP_DB_HOST)');
        return;
    }

    try {
        // connect to mongo
        targetDbConnection = await openDB(targetUrl);
        sourceDbConnection = await openDB(sourceUrl);

        // backup (rename) destination DB
        await backupDatabase(targetDbConnection)

        // copy DB from source to destination
        await copyDatabase(sourceDbConnection, targetDbConnection);

    } catch (error) {
        console.error(error);
    } finally {
        // disconnect DB
        await closeDB(sourceDbConnection);
        await closeDB(targetDbConnection)
    }
}

function initDotEnv() {
    dotenv.config();
    dotenv.config({path: '../../.env'});
}

async function openDB(url) {
    console.info(`Setup connection to ${url}`);
    const client = new MongoClient(url);
    await client.connect();
    await client.db().command({ping: 1});
    return client;
}

async function backupDatabase(connection) {
    const newName = `${connection.db().databaseName}${backupPostfix}`;
    console.info(`Rename database ${connection.db().databaseName} -> ${newName}`);

    await connection.db(newName).dropDatabase()
    await copyDB(connection, connection, newName);
}

async function copyDatabase(sourceDbConnection, targetDbConnection) {
    console.info(`Migrate database ${sourceDbConnection.db().databaseName} to ${targetDbConnection.db().databaseName}`);

    await targetDbConnection.db().dropDatabase()
    await copyDB(sourceDbConnection, targetDbConnection);
}

async function copyDB(source, target, targetDbName) {
    const collections = await source.db().listCollections().toArray();
    for (const collection of collections) {
        const name = collection.name;
        const srcCollection = source.db().collection(name);
        const dstCollection = target.db(targetDbName).collection(name)

        console.info(`Copy collection ${name}`);

        target.db(targetDbName).createCollection(name)

        // copy documents
        const data = await srcCollection.find({}).toArray()
        await dstCollection.insertMany(data);

        // copy indexed
        const dataIndex = await srcCollection.indexes()
        await dstCollection.createIndexes(dataIndex);
    }
}

async function closeDB(connection) {
    if (connection) {
        console.info(`Close connection to ${connection.s.url}`);
        await connection.close();
    } else {
        console.info(`Close connection not need`);
    }
}


// ---- start main script
console.info('DB migration tool start');

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script catch error:', error);
        process.exit(1);
    });

console.info('DB migration tool finished');
