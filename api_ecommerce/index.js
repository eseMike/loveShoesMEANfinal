import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import router from './router/index.js';
import { fileURLToPath } from 'url';

// Simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conexión a la base de datos
mongoose.Promise = global.Promise;
const dbUrl = 'mongodb://localhost:27017/plantilla-ecommerce';
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    console.log('Conectado a la base de datos en la url: ' + dbUrl)
  )
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use('/api/', router);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log('Servidor corriendo en el puerto ' + app.get('port'));
});