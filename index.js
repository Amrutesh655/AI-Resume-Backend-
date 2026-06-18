const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authroutes");
const resumeRoutes = require("./routes/resumeroutes");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authroutes);
app.use("/api/resume", resumeroutes);


app.get('/',( req,res) =>{
   res.send('"AI resume Analyzer API is running');
});

const port  = process.env.PORT || 5000;

app.listen(port,() =>{
    console.log('server is runnning on port 5000');
});