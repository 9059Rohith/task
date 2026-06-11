const mongoose = require('mongoose');
require('dotenv').config();

const clearData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');
    
    console.log('Dropping database...');
    await mongoose.connection.db.dropDatabase();
    
    console.log('Data cleared successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing data:', err);
    process.exit(1);
  }
};

clearData();
