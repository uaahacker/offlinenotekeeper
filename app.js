const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

// Serve static files from the 'public' folder

app.use(express.static('public'));

// ... your other routes or code ...

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


