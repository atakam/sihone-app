const { Pool } = require('pg');
const databaseConfiguration = {
    user: 'ylqtrk8h1arugxyd',
    host: 'co28d739i4m2sb7j.cbetxkdyhwsb.us-east-1.rds.amazonaws.com', //'churchbraindb.c6nccd29fuwa.us-east-2.rds.amazonaws.com',
    database: 'xclq9gvi38tfeu8a',
    password: 'a2r2sdxkz1jfak9a',
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
