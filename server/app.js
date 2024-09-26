const express = require("express");
const cors = require("cors");
const app = express();
const dotenv= require('dotenv');
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Data = require('../server/models/dataschema');

//DOTENV
dotenv.config();

//MONGOOSE CONNECTION
const mongoURL = process.env.MONGOURL; 

const connecttoDB = async () => {
    try {
      await mongoose.connect(mongoURL);
      console.log(`Connected to MongoDB ${mongoose.connection.host}`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  };
connecttoDB();

// async function importData() {
//     try {
//         const dataPath = path.join(__dirname, 'jsondata.json');
//         const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

//         await Data.deleteMany({});
//         await Data.insertMany(data);
        
//         console.log('Data imported successfully.');
//     } catch (err) {
//         console.error('Error importing data', err);
//     }
// };
// importData();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//ROUTES
app.use('/api/v1/data', require("./routes/dataroutes"));

//PORT 
const port = 8080;

//LISTEN
app.listen(port, ()=> { 
    console.log(`app is listening on port ${port}`);
});
