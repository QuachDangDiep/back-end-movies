const express = require('express');
const db = require('../firebaseConfig');
const router = express.Router();

// Lấy danh sách phim
router.get('/', async (req, res) => {
  try {
    const moviesSnapshot = await db.collection('movies').get();
    const movies = {};
    moviesSnapshot.forEach(doc => {
      movies[doc.id] = doc.data();
    });
    res.json(movies);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Lấy thông tin ghế cho một bộ phim cụ thể
router.get('/:movieId/seats', async (req, res) => {
  const { movieId } = req.params;
  try {
    const movieDoc = await db.collection('movies').doc(movieId).get();
    if (!movieDoc.exists) {
      return res.status(404).send('Movie not found');
    }
    res.json(movieDoc.data().seats);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Đặt ghế
router.post('/:movieId/book', async (req, res) => {
  const { movieId } = req.params;
  const { seatId, userId } = req.body; // Thông tin ghế và người dùng
  try {
    const movieDoc = await db.collection('movies').doc(movieId).get();
    if (!movieDoc.exists) {
      return res.status(404).send('Movie not found');
    }

    const seats = movieDoc.data().seats;
    if (seats[seatId].status !== 'available') {
      return res.status(400).send('Seat is not available');
    }

    // Cập nhật trạng thái ghế thành locked
    seats[seatId].status = 'locked';
    seats[seatId].lockTime = admin.firestore.Timestamp.now();

    await db.collection('movies').doc(movieId).update({ seats });
    
    // Cập nhật thông tin người dùng (giả sử bạn đã có route cho người dùng)
    await db.collection('users').doc(userId).update({
      bookedSeats: admin.firestore.FieldValue.arrayUnion(`${movieId}-${seatId}`)
    });

    res.send('Seat booked successfully');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
