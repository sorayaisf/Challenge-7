'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.UserGameBiodata, {
        foreignKey: 'userId'
      });
      this.hasMany(models.UserGameHistory, {
        foreignKey: 'userId'
      });
    }

    static encrypt = password => bcrypt.hashSync(password, 10);

    static register = ({
      username,
      email,
      password,
      role
    }) => {
      const encryptedPassword = this.encrypt(password);


      return this.create({
        username,
        email,
        password: encryptedPassword,
        role,
      });
    };

    checkPassword = password => bcrypt.compareSync(password, this.password);

    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
      };

      const secretKey = 'rahasia-sekali';

      const token = jwt.sign(payload, secretKey);
      return token;
    };

    static authenticate = async ({
      username,
      password
    }) => {
      try {
        const user = await this.findOne({
          where: {
            username
          }
        });
        if (!user)
          return Promise.reject(
            new Error('User not found! Please register first')
          );

        const validatePasswords = user.checkPassword(password);
        if (!validatePasswords)
          return Promise.reject(new Error('Invalid password!'));

        return Promise.resolve(user);
      } catch (err) {
        return console.log(err);
      }
    };

  }
  UserGame.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please input your username',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please input your email address',
        },
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please input your password',
        },
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
      allowNull: false,
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'UserGame',
  });
  return UserGame;
};