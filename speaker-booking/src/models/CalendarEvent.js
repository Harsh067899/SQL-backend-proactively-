const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:Gyan@2003@localhost:3306/speaker'); // Update with your database credentials

const CalendarEvent = sequelize.define('CalendarEvent', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('CalendarEvent model synced with the database'))
  .catch((error) => console.log('Error syncing CalendarEvent model:', error));

module.exports = CalendarEvent;
