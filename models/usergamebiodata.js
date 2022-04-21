'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGameBiodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.UserGame, {
        foreignKey: 'userId'
      });
    }
  }
  UserGameBiodata.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    nationality: DataTypes.STRING,
    hobby: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserGameBiodata',
  });
  return UserGameBiodata;
};