const { Pool } = require('pg');
const databaseConfiguration = {
    user: 'sctbckje',
    host: 'baasu.db.elephantsql.com', //'churchbraindb.c6nccd29fuwa.us-east-2.rds.amazonaws.com',
    database: 'sctbckje',
    password: 'N6gW0bjDrYfn-i_Un1w6HY8mhvv_u84j',
    port: 5432
};

const pool = new Pool(databaseConfiguration);

module.exports = pool;

// const { Pool } = require('pg');
// const databaseConfiguration = {
//     user: 'wgyvwcfk',
//     host: 'elmer.db.elephantsql.com', //'churchbraindb.c6nccd29fuwa.us-east-2.rds.amazonaws.com',
//     database: 'wgyvwcfk',
//     password: 'Ecz0voOUXOqgFG8gd8oQuaArpGiMqoSX',
//     port: 5432
// };

// const pool = new Pool(databaseConfiguration);

// module.exports = pool;
