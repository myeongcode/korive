const { path, axios } = require('../modules');
const router = require('express').Router();

router.get('/:id', async (req, res) => {
  try {
    const getVideoAPI = 'http://localhost:8080/api/videos';
    const response = await axios.get(getVideoAPI);
    res.render('Detail/index.ejs', {
      id: req.params.id,
      data: response.data[req.params.id - 1],
    });
  } catch (e) {
    console.error('Error fetching data from API : ', e);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
