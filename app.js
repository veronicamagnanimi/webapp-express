const express = require("express");
const app = express();
const port = process.env.SERVER_PORT;
const moviesRouter = require("./routers/movies");
const errorsHandler = require("./middleware/errorsHandler");

//rotte
app.use("/movies", moviesRouter);

//asset statici
app.use(express.static("public"));

//middleware
app.use(errorsHandler);

app.listen(port, () => {
    console.log("Server is running")
})