import sequelize from 'sequelize';

const sequelize = new sequelize('mixer', null, null, {
    host: 'localhost',
    dialect: 'sqlite3',
});

const db = {
    User: sequelize.import('./userModel')
};

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

export default db;