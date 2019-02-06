const express = require('express');
const path = require('path');

const app = require('./app');
app.use(express.static(path.join(__dirname, 'client/build')));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));

const pool = require('./databasePool');
pool.query(`SELECT * FROM members`, (error, response) => {
    let connected = false;
    if (error) connected = false;
    else connected = true;
    console.error(`Database connection: ${connected}`);
});