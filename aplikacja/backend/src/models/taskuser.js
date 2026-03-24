const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TaskUser = sequelize.define('TaskUser', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        taskId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'tasks',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        timestamps: false,
        tableName: 'task_users'
    });

    return TaskUser;
};
