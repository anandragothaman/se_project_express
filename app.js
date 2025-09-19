const express = require("express");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mainRouter = require("./routes/index");
const { errors } = require("celebrate");

app.use(helmet());
app.disable("x-powered-by");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);
app.use(cors());
app.use(express.json());
app.use("/", mainRouter);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
