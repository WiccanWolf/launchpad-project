import app from 'backend/index.js';
const PORT = process.env.PORT || 5100;

app.listen(PORT, () =>
  console.log(`Backend is running on http://localhost:${PORT}`)
);
