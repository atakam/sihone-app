const app = require('./app');
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));

const pool = require('./databasePool');
pool.query(`SELECT * FROM members`, (error, response) => {
    let connected = false;
    if (error) connected = false;
    else connected = true;
    console.error(`Database connection: ${connected}`);
});