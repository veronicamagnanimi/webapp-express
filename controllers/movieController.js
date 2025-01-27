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
