// src/config/database.js

const { Sequelize, DataTypes } = require('sequelize');

// Connect to MySQL database using Sequelize
const sequelize = new Sequelize('mysql://root:Gyan@2003@localhost:3306/speaker', {
  dialect: 'mysql',
  logging: false,  // Disable logging for cleaner output
  define: {
    freezeTableName: true,  // Ensure table names are not pluralized
    timestamps: true,  // Enable timestamps (createdAt, updatedAt)
  },
});

// Authenticate the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Import models
const User = require('../models/User')(sequelize, DataTypes);
const Speaker = require('../models/Speaker')(sequelize, DataTypes);
const Appointment = require('../models/Appointment')(sequelize, DataTypes);
const TimeSlot = require('../models/TimeSlot')(sequelize, DataTypes);

// Define associations (if any)
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Speaker.hasMany(Appointment, { foreignKey: 'speakerId' });
Appointment.belongsTo(Speaker, { foreignKey: 'speakerId' });

TimeSlot.hasMany(Appointment, { foreignKey: 'timeSlotId' });
Appointment.belongsTo(TimeSlot, { foreignKey: 'timeSlotId' });

// Sync database to create tables (alter: true will adjust the schema if needed)
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Export the sequelize instance and models
module.exports = { sequelize, User, Speaker, Appointment, TimeSlot };
