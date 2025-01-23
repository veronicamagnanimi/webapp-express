const express = require("express");
const app = express();
const port = process.env.SERVER_PORT;
const moviesRouter = require("./routers/movies");

//rotte
app.use("/movies", moviesRouter);


app.listen(port, () => {
    console.log("Server is running")
})