import sequelize from 'sequelize';

const UserModel = sequelize.define('user', {
    username: { type: sequelize.STRING },
});

export default UserModel