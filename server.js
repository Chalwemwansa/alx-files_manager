// module contains code that makes an a express server in js using the
// express module
import express from 'express';
import indexRoutes from './routes/index'

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

// use the indexRoutes Router from the index module
app.use('/', indexRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});