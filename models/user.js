module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    email: DataTypes.STRING,
    provider: {
      type: DataTypes.ENUM,
      values: ["google"],
      required: true,
    },
    providerId: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    oauthExpiresAt: DataTypes.DATE,
  });
  return User;
};
