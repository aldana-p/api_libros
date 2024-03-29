const express = require("express");
const routerLibros = express.Router();
const libros = require("../data");
const Joi = require("joi");

const libroSchema = Joi.object({
  titulo: Joi.string().required().label("Titulo"),
  autor: Joi.string().required().label("Autor"),
});

// Para obtener todos los libros
routerLibros.get("/", (req, res, next) => {
  try {
    res.json(libros);
  } catch (err) {
    next(err);
  }
});

// Para obtner un libro por id
routerLibros.get("/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }

    res.json(libro);
  } catch (err) {
    next(err);
  }
});

//Para crear un nuevo libro
routerLibros.post("/", (req, res, next) => {
  try {
    const { error, value } = libroSchema.validate(req.body);
    if (error) {
      const validationError = new Error("Error de validación");
      validationError.status = 400;
      validationError.details = error.details.map((detail) => detail.message);
      throw validationError;
    }

    const { titulo, autor } = value;

    const nuevoLibro = {
      id: libros.length + 1,
      titulo,
      autor,
    };

    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
  } catch (err) {
    next(err);
  }
});

// Actualizar libro existente
routerLibros.put("/:id", (req, res, next) => {
  try {
    const id = req.query.params.id;
    const { error, value } = libroSchema.validate(req.body);
    if (error) {
      const validationError = new Error("Error de validación");
      validationError.status = 400;
      validationError.details = error.details.map((detail) => detail.message);
      throw validationError;
    }

    const { titulo, autor } = value;
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }

    libro.titulo = titulo || libro.titulo;
    libro.autor = autor || libro.autor;

    res.json(libro);
  } catch (err) {
    next(err);
  }
});

// Eliminar un libro
routerLibros.delete("/", (req, res, next) => {
  try {
    const id = req.query.params.id;
    const index = libros.findIndex((l) => l.id === id);

    if (index === -1) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }

    const libroEliminado = libros.splice(index, l);
    res.json(libroEliminado[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = routerLibros;
