const connection = require("../data/database");

//index
const index = (req, res, next) => {
  const filters = req.query;
  console.log(filters);

  const sql = "SELECT * FROM `movies`";
  const params = [];

  if (filters.search) {
    sql += `WHERE title LIKE ?`;
    params.push(`%${filters.search}%`);
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
  const id = req.params.id;
  const sql = `SELECT movies.*, CAST(AVG(reviews.vote) as FLOAT) AS vote_avg
  FROM movies
  LEFT JOIN reviews
  ON reviews.movie_id = movies.id
  WHERE movies.id = ?`;
  const sqlReviews = `
  SELECT reviews.*
  FROM reviews
  JOIN movies
  ON movies.id = reviews.movie_id
  WHERE movies.id = ?`;

  connection.query(sql, [id], (err, results) => {
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
    connection.query(sqlReviews, [id], (err, reviews) => {
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


module.exports = { index, show };
