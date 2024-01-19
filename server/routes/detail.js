const { path } = require('../modules');
const router = require('express').Router();

router.get('/:id', (req, res) => {
  res.render('Detail/index.ejs', { id: req.params.id });
});

module.exports = router;
