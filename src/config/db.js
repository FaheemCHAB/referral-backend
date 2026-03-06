const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB");
        console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB