const connection = require("../data/database");

//index
const index = (req, res, next) => {
  const sql = "SELECT * FROM `movies`";

  connection.query(sql, (err, movies) => {
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
  const sql = "SELECT * FROM `movies` WHERE id=?";
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
