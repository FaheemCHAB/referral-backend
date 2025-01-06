const express  = require("express");
const userRouter = require("./routes/user-routes");
const referralRouter = require("./routes/referral-routes");
const connectToDB = require("./config/db");
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/user", userRouter);
app.use("/referral", referralRouter);

const PORT = process.env.PORT || 4000;

connectToDB();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
