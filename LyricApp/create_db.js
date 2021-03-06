const dbname = 'Transracer.db';
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(dbname);

// run each database statement *serially* one after another
// (if you don't do this, then all statements will run in parallel,
//  which we don't want)
db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE songs_to_lyrics (title TEXT COLLATE NOCASE, artist TEXT COLLATE NOCASE, language TEXT, oLyric TEXT, tLyric TEXT, score INTEGER)");

  
  // table 'account' does not allow duplicate usernames
  db.run("CREATE TABLE account (username TEXT, password TEXT NOT NULL, PRIMARY KEY (username))");
  
  // table 'score' has a many to one relationship to 'account' username
  db.run("CREATE TABLE score (username TEXT NOT NULL, score INTEGER NOT NULL, title TEXT COLLATE NOCASE, artist TEXT COLLATE NOCASE, date TEXT, FOREIGN KEY (username) REFERENCES account(username), FOREIGN KEY (title, artist) REFERENCES songs_to_lyrics(title, artist))");

  // insert 3 rows of data:
  db.run("INSERT INTO songs_to_lyrics VALUES ('Hirugohan', 'Gundam', 'ja', 'Hirugohan taberu', 'I eat lunch', 2)");
  db.run("INSERT INTO songs_to_lyrics VALUES ('Wufan', 'Gaoda', 'zh-cn', 'Wo chi wufan', 'I eat lunch', 50)");
  // To check if artist and album works
  db.run("INSERT INTO songs_to_lyrics VALUES ('Hirugohan', 'Totoro', 'JP', 'Chuushoku toru', 'I eat lunch', 2)");
  // Multiline try
  db.run("INSERT into songs_to_lyrics VALUES('Untouchable, Part 1', 'Anathema', 'es', 'Tuve que dejarte ir' || char(10) || 'A la puesta de sol', 'I had to let you go' || char(10) || 'To the setting sun', 40)");

  db.run("INSERT INTO account VALUES ('admin', 'admin')");
  db.run("INSERT INTO score VALUES ('admin', 50, 'Hirugohan', 'Gundam', '2018-05-20')");
  db.run("INSERT INTO score VALUES ('admin', 100, 'Hirugohan', 'Gundam', '2018-05-22')");
  db.run("INSERT INTO score VALUES ('admin', 300, 'Hirugohan', 'Gundam', '2018-05-24')");
  db.run("INSERT INTO score VALUES ('admin', 40, 'Hirugohan', 'Gundam', '2018-05-28')");

  console.log('successfully created the songs_to_lyrics table in ' + dbname);
  console.log('--------------------');

  // print them out to confirm their contents:
  db.each("SELECT title, artist, language, oLyric, tLyric FROM songs_to_lyrics", (err, row) => {
    console.log('Title:', row.title);
    console.log('Artist:', row.artist);
    console.log('Language:', row.language);
    console.log('Original Lyric:', row.oLyric);
    console.log('Translated Lyric:', row.tLyric);
    console.log('--------------------');
  });
});

db.close();
