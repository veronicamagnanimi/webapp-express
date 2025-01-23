const connection = require("../data/database");

//index
const index = (req, res) => {
    res.json({
        message: "Index dei film"
    });
}

//show
const show = (req, res) => {
    res.json({
        message: "Show dei film"
    });
}


module.exports = {index, show}
