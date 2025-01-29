const connection = require("../data/database");

//index
const index = (req, res, next) => {
  const filters = req.query;
  console.log(filters);

  let sql = "SELECT * FROM `movies`";
  const params = [];
  const conditions = [];

  if (filters.search) {
    sql += `WHERE title LIKE ?`;
    params.push(`%${filters.search}%`);
  }

  for (const key in req.query) {
    if (key !== "search") {
      conditions.push(`${key} = ?`);
      params.push(req.query[key]);
    }
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  connection.query(sql, params, (err, movies) => {
    if (err) {
      return next(new Error(err.message));
    }
    return res.status(200).json({
      status: "success",
      data: movies,
    });
  });
};

//show
const show = (req, res, next) => {
  const slug = req.params.slug;
  const sql = `SELECT movies.*, CAST(AVG(reviews.vote) as FLOAT) AS vote_avg
  FROM movies
  LEFT JOIN reviews
  ON reviews.movie_id = movies.id
  WHERE movies.slug = ?`;
  const sqlReviews = `
  SELECT reviews.*
  FROM reviews
  JOIN movies
  ON movies.id = reviews.movie_id
  WHERE movies.slug = ?`;

  connection.query(sql, [slug], (err, results) => {
    if (err) {
      return next(new Error(err.message));
    }
    if (results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not found",
      });
    }

    //query reviews
    connection.query(sqlReviews, [slug], (err, reviews) => {
      if (err) {
        return next(new Error(err.message));
      }

      return res.status(200).json({
        status: "success",
        data: {
          ...results[0],
          reviews,
        },
      });
    });
  });
};

//create
const createReview = (req, res, next) => {
  const id = req.params.id;
  const {name, vote, text} = req.body;
  console.log("recensione", id)
 

//validation 
if(isNaN(vote) || vote < 0 || vote > 5) {
  res.status(400).json({
    status: "fail",
    message: "Complete the review correctly"
  })
}  

if(text && text.length > 0 && text.length < 5) {
  res.status(400).json({
    status: "fail",
    message: "The text must be at least five characters long"
  })
}

//error id
  const movieSql = `SELECT * FROM movies WHERE id = ?`
  connection.query(movieSql, [id], (err, results) => {
    if(err) {
      return next(new Error(err.message));
    }
    if(results.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Movie not found"
      })
    }
  })

  const sql = `INSERT INTO reviews(movie_id, name, vote, text)
  VALUES(?, ?, ?, ?)`;
  connection.query(sql, [id, name, vote, text], (err, results) => {
    if(err) {
      return next(new Error(err.message));
    }
    res.status(201).json({
      status: "success",
      message: "Review added successfully"
    })

  })
}

//store 
const store = (req, res, next) => {
  const imageName = req.file.fileName;
  const {title, director, genre, release_year, abstract} = req.body;
  const slug = slugify(title, {
    lower: true, strict: true
  });
  const sql = `INSERT INTO movies (slug, title, director, genre, release_year, abstract, image 
  VALUES (?, ?, ?, ?, ?, ?, ?)`;
  connection.query (sql, [slug, title, director, genre, release_year, abstract, imageName], (err, results) => {
    if (err)  {
      return next(new Error(err.message));
    }
  })
  return res.status(201).json({
    status: "success",
    message: "Ok"
  })
}



module.exports = { index, show, createReview, store };
