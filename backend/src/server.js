import app from './app.js';
import dotenv from "dotenv";


dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 7002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
