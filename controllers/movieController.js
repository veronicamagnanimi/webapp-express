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
        data: movies
    })
  });
};

//show
const show = (req, res) => {
  res.json({
    message: "Show dei film",
  });
};

module.exports = { index, show };
