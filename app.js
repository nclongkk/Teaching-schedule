const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes/index");
const app = express();

//load env var
dotenv.config();

// Enable CORS
app.use(cors());

//Body parser
app.use(express.json());

//routes
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
