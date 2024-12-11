module.exports = (sequelize, DataTypes) => {
  const Speaker = sequelize.define('Speaker', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
    },
  });

  return Speaker; // This ensures Speaker is returned for usage in your controller
};
