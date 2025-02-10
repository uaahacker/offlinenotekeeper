const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from your frontend during development
    // For production, you would specify your actual frontend domain
}));
app.use(express.static('public'));

// ... your other routes or code ...

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


