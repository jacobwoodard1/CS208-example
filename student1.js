import express from 'express';
import sql from 'sqlite3';

const sqlite3 = sql.verbose();
const db = new sqlite3.Database(':memory:');

const app = express();
app.use(express.static('public'));
app.set('views', 'views/student1');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));


app.listen(3001, function () {
  console.log('Listening on port 3001...');
});
