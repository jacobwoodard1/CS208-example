import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run('CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT,student TEXT NOT NULL,comment TEXT NOT NULL)')

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

// author: Jacob Woodard
// This function renders the home page 
// and can be called from any page
app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

// TO STUDENT1 PAGE
// author: Jacob Woodard
// This renders the student 1 major homepage
// It can be called from any page
app.get('/student1', function (req, res) {
  console.log('GET called')
  const local = { comments: [] };
  db.each('SELECT id, student, comment FROM comments WHERE student = "student1"', function(err, row) {
    if(err) {
      console.log(err);
    } else {
      local.comments.push({ id: row.id, student: row.student, comment: row.comment });
    }
  }, function (err, numrows) {
    if(!err) {
      res.render('student1', local)
    } else {
      console.log(err)
    }
  })
})

// TO STUDENT2 PAGE
app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

// TO STUDENT3 PAGE
app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// TO STUDENT1 COMMENT PAGE
// author: Jacob Woodard
// This takes the user to the comments page for studetn 1 major.
// The user can add delete and edit comments.
app.get('/comments1', function (req, res) {
  console.log('GET called');
  
  const local = { comments: [] };
  db.each('SELECT id, student, comment FROM comments WHERE student = "student1"', function(err, row) {
    if(err) {
      console.log(err);
    } else {
      local.comments.push({ id: row.id, student: row.student, comment: row.comment });
    }
  }, function (err, numrows) {
    if(!err) {
      res.render('student1/comments', local);
    } else {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// POST COMMENT STUDENT1
// author: Jacob Woodard
// This method posts a comment to the student 1 column of the SQL table.
app.post('/comment1', function (req, res) {
  console.log('adding comment for student1');

  const stmt = db.prepare("INSERT INTO comments (student, comment) VALUES (?, ?)");
  stmt.run('student1', req.body.comment);
  stmt.finalize();
  res.redirect('/comments1');
});

// DELETE COMMENT STUDENT1
// This method removes the selected id comment from the SQL table
// author: Jacob Woodard
app.post('/deleteComment/:id', function (req, res) {
  console.log('deleting comment for student1');

  const commentId = req.params.id;

  db.run('DELETE FROM comments WHERE id = ?', commentId, function (err) {
    if (err) {
      console.error('Error deleting comment:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/comments1');
    }
  });
});

// update student1
// This comment allows the user to type an updated comment into the text box.
// author: Jacob Woodard
app.post('/updateComment/:id', function (req, res) {
  console.log('POST update comment for student1');

  const commentId = req.params.id;

  const stmt = db.prepare('UPDATE comments SET comment = ? WHERE id = ?');
  stmt.run(req.body.comment, commentId);
  stmt.finalize();

  res.redirect('/comments1');
});


// STUDENT 2 COMMENTS



// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
