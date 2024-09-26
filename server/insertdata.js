const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Data = require('../server/models/dataschema');

// Replace with your MongoDB connection string
const mongoURL = process.env.MONGOURL; 

const connecttoDB = async () => {
    try {
      await mongoose.connect(mongoURL);
      console.log(`Connected to MongoDB ${mongoose.connection.host}`);
      mongoose.connection.close();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  };
connecttoDB();


async function importData() {
    try {
        const dataPath = path.join(__dirname, 'jsondata.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        await Data.deleteMany({});
        await Data.insertMany(data);
        
        console.log('Data imported successfully.');
    } catch (err) {
        console.error('Error importing data', err);
    }
};
importData();