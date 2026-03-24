// models/task.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Task = sequelize.define('Task', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        status: { type: DataTypes.ENUM('todo', 'inprogress', 'done'), defaultValue: 'todo' },
        priority: { type: DataTypes.ENUM('high', 'low', 'normal'), defaultValue: 'low' },
        dueDate: { type: DataTypes.DATE, allowNull: true }
    }, {
        timestamps: true,
        tableName: 'tasks'
    });

    return Task;
};
