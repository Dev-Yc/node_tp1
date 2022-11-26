const express = require('express');
const Paths = require('./paths/csv');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', Paths);


app.listen(3000, () => {
  console.log('Successfully started express application!');
});

