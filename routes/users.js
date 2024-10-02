const express = require('express');
const router = express.Router();
const db = require('../firebaseConfig'); // Nhập file cấu hình Firebase

// Endpoint để lấy danh sách người dùng
router.get('/', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = {};
    usersSnapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint để thêm một người dùng mới
router.post('/', async (req, res) => {
  try {
    const { name, email, bookedSeats } = req.body;
    const newUserRef = await db.collection('users').add({
      name,
      email,
      bookedSeats: bookedSeats || [],
    });
    res.status(201).json({ id: newUserRef.id });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint để cập nhật một người dùng theo ID
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update(req.body);
    res.status(200).send(`User with ID: ${userId} updated successfully.`);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint để xóa một người dùng theo ID
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await db.collection('users').doc(userId).delete();
    res.status(200).send(`User with ID: ${userId} deleted successfully.`);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
