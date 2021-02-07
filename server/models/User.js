import { Sequelize, DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt'

import sequelize from "../config/db.config";

class User extends Model {
    getFullname() {
        return [this.firstname, this.lastname].join(' ');
    }
    checkPassword(password) {
        return new Promise(async (resolve, reject) => {
            try {
                const isMatch = await bcrypt.compare(password, this.password)
                resolve(isMatch)
            } catch (err) {
                reject(err)
            }
        })
    }
}

User.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    firstname: {
        type: DataTypes.STRING,
    },
    lastname: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            is: {
                args: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
                msg: 'Provided email doesn\'t match an email format'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: ["^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&-_*])(?=.{8,})"],
                msg: 'Password must have at least 1 Uppercase 1 lowercase 1 number and one character'
            }
        }
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'User',
})

User.addHook('beforeSave', async (user) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        return;
    } catch (error) {
        return error;
    }
});


export default User