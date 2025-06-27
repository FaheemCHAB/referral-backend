const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB