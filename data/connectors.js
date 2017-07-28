import sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';
import fetch from 'node-fetch';
import Mongoose from 'mongoose';

const db = new sequelize('mixer', null, null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './mixer.sqlite',
});


const UserModel = db.define('user', {
    firstName: { type: sequelize.STRING },
    lastName: { type:  sequelize.STRING },
});

// Create mock data with seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then (() => {
    _.times(10, () => {
        return UserModel.create({
            firstName: casual.first_name,
            lastName: casual.last_name,
        });
    });
});

const User = db.models.user;

// Mongoose connect 
const mongo = Mongoose.connect('mongodb://localhost/views');

const ViewSchema = Mongoose.Schema({
    Id: Number,
    views: Number,
});

const View = Mongoose.model('views', ViewSchema);

// Modify the mock data creation to also create views
casual.seed(123);
db.sync({ force: true }).then(() => {
    return UserModel.create({
        firstName: casual.first_name,
        lastName: casual.last_name,
    });
});

export { User, View };