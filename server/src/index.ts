import express, { Request, Response } from 'express';
import db from './db';
const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});


// Test database connection
db.query("SELECT 1")
  .then(() => console.log("✅ MySQL Connected!"))
  .catch((err) => console.error("❌ MySQL Connection Error:", err));


app.listen(3000, () => console.log('Server running on port 3000'));
