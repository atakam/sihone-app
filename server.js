const app = require('./app');
const path = require('path');
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5005;
app.listen(port, () => console.log(`listening on port ${port}`));

const pool = require('./databasePool');
pool.query(`SELECT * FROM members`, (error, response) => {
    let connected = false;
    if (!error) {
        connected = true
    }
    console.error(`Database connection: ${connected}`);
});