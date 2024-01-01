const express = require("express");
const app = express();
const routerLibros = require("./routes/libros");
const errorHandler = require("./middlewares/errorHandler");
app.use(express.json());

app.use("/libros", routerLibros);

app.use(errorHandler);

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor Express.js en funcionamiento en el puerto ${port}`);
});
