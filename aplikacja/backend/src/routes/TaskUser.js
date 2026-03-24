 // models/taskUser.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TaskUser = sequelize.define('TaskUser', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        taskId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'task_users'
    });

    return TaskUser;
};
