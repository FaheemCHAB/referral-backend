const express  = require("express");
const userRouter = require("./routes/user-routes");
const referralRouter = require("./routes/referral-routes");
const rewardRouter = require("./routes/reward-routes");
const bonusRouter = require("./routes/bonus-routes");
const connectToDB = require("./config/db");
const cors = require("cors");

require('dotenv').config();

const app = express();

app.use(express.json());

const options = {
    origin: [process.env.APP_URL],
    credentials: true // if you're using cookies or auth headers
  };
  

app.use(cors(options));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/user", userRouter);
app.use("/referral", referralRouter);
app.use("/reward", rewardRouter);
app.use("/bonus", bonusRouter);

const PORT = process.env.PORT || 4000;

connectToDB();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
