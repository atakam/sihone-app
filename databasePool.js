const { Pool } = require('pg');
const databaseConfiguration = {
    user: 'knlnsgle',
    host: 'baasu.db.elephantsql.com', //'churchbraindb.c6nccd29fuwa.us-east-2.rds.amazonaws.com',
    database: 'knlnsgle',
    password: '6Sh52hcm3kCmfGVoR1x79T0GH1plFZ7c',
    port: 5432
};

const pool = new Pool(databaseConfiguration);

module.exports = pool;
