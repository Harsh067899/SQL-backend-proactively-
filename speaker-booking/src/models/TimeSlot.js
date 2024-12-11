// src/models/TimeSlot.js

module.exports = (sequelize, DataTypes) => {
  const TimeSlot = sequelize.define('TimeSlot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return TimeSlot;
};
