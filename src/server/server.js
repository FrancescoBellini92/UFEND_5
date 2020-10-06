const app = require('./controller/app.controller');
const { PORT } = require('./environment');


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
