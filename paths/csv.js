const router = require('express').Router();

router.get('/tp1', (req, res) => {
  res.send('test');
});

module.exports = router;