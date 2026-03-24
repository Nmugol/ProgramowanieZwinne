require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // pozwala serwować awatary
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,   // dodaj
        dialect: 'postgres'          // bo Supabase to PostgreSQL, a nie MySQL!
    }
);

// Initialize models (import tutaj!)
const User = require('./models/user')(sequelize);
const Task = require('./models/task')(sequelize);

// Pass sequelize and models to routes
app.use('/api', userRoutes(User));
app.use('/api', taskRoutes(Task));

// Test connection and sync models then start server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync({ alter: true }); // Tworzy/aktualizuje tabele
    })
    .then(() => {
        console.log('Database synced (tables created or updated if needed)');
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Database connection or sync error:', err);
    });
