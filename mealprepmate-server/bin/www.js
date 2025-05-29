const port = process.env.PORT || 3000;
const app = require('../app');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
