const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Get a single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      dueDate, 
      isRecurring, 
      frequency, 
      interval, 
      weekDays, 
      monthDay, 
      startDate, 
      endDate 
    } = req.body;
    
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        isRecurring,
        frequency,
        interval,
        weekDays: weekDays || [],
        monthDay,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      completed, 
      dueDate, 
      isRecurring, 
      frequency, 
      interval, 
      weekDays, 
      monthDay, 
      startDate, 
      endDate 
    } = req.body;
    
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        completed,
        dueDate: dueDate ? new Date(dueDate) : null,
        isRecurring,
        frequency,
        interval,
        weekDays: weekDays || [],
        monthDay,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        updatedAt: new Date(),
      },
    });
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Toggle todo completion status
app.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        completed: !todo.completed,
        updatedAt: new Date(),
      },
    });
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error toggling todo completion:', error);
    res.status(500).json({ error: 'Failed to toggle todo completion' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;