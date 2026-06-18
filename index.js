const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);


app.get('/',( req,res) =>{
   res.send('"AI resume Analyzer API is running');
});

const port  = process.env.PORT || 5000;

app.listen(5000,() =>{
    console.log('server is runnning on port 5000');
});