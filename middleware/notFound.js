const notFound = (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: "Page not found"
    })
}


module.exports = notFound;