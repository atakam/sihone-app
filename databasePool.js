const { Pool } = require('pg');
const databaseConfiguration = {
    user: 'clgmhytu',
    host: 'rajje.db.elephantsql.com', //'churchbraindb.c6nccd29fuwa.us-east-2.rds.amazonaws.com',
    database: 'clgmhytu',
    password: 'm1sGvfb4sQrgS_5sj1R6064apdyIIplu',
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