const express = require("express");
const app = express();
const port = process.env.SERVER_PORT;
const moviesRouter = require("./routers/movies");
const errorsHandler = require("./middleware/errorsHandler");
const notFound = require("./middleware/notFound");
const cors = require("cors");

//middleware cors
app.use(cors({
    origin: process.env.FRONTEND_URL
}))

//rotte
app.use("/movies", moviesRouter);

//asset statici
app.use(express.static("public"));

//middleware
app.use(errorsHandler);
app.use(notFound);

app.listen(port, () => {
    console.log("Server is running")
})