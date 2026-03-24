const express = require('express');

module.exports = (Task) => {
    const router = express.Router();

    // Pobierz wszystkie zadania
    router.get('/tasks', async (req, res) => {
        try {
            const tasks = await Task.findAll();
            res.json(tasks);
        } catch (err) {
            res.status(500).send('Server error');
        }
    });

    // Dodaj nowe zadanie
    router.post('/tasks', async (req, res) => {
        try {
            const { title, description, status, priority, dueDate } = req.body;
            if (!title) return res.status(400).send('Title is required');

            const newTask = await Task.create({ title, description, status, priority, dueDate });
            res.status(201).json(newTask);
        } catch (err) {
            res.status(500).send('Server error');
        }
    });

    // Aktualizuj zadanie (np. status)
    router.put('/tasks/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const task = await Task.findByPk(id);
            if (!task) return res.status(404).send('Task not found');

            await task.update(req.body);
            res.json(task);
        } catch (err) {
            res.status(500).send('Server error');
        }
    });

    // Usuń zadanie
    router.delete('/tasks/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const task = await Task.findByPk(id);
            if (!task) return res.status(404).send('Task not found');

            await task.destroy();
            res.send('Task deleted');
        } catch (err) {
            res.status(500).send('Server error');
        }
    });

    return router;
};
