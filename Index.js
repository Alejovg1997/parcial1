// Importación de módulos y configuración de variables de entorno
const express = require('express');
const app = express();
const fs = require('fs');
require('dotenv').config(); // Importamos la librería dotenv para cargar variables de entorno
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3000; // Configuración del puerto del servidor
const APP_NAME = process.env.APP_NAME || 'My app'; // Nombre de la aplicación
const http = require('http');
const path = require('path');

// Importación de un módulo personalizado para leer y escribir archivos
const { readFile, writeFile } = require('./src/files.js');

const FILE_NAME = './DB/books.txt'; // Archivo utilizado para almacenar datos de mascotas




app.use(express.urlencoded({ extended: false }));
app.use(express.json());




app.set('views','src/views');
app.set('view engine','ejs');
// Rutas

// Registra la solicitud en access_log.txt
const server = http.createServer((req, res) => {
    
    const logEntry = `${new Date().toUTCString()} - ${req.method} ${req.url}\n`;
    fs.appendFile('access_log.txt', logEntry, (err) => {
      if (err) {
        console.error('Error al escribir en el archivo de registro', err);
      }
    });
  
    // Responde a la solicitud
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Solicitud registrada en access_log.txt\n');
  });
  
// Saludo personalizado
app.get('/hola/:name', (req, res) => {
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    const students_list=['juan','perdro','maria'];
  // res.send(`Hello ${formal ? 'Mr.' : ''} ${name} ${type ? ' ' + type : ''}`);
  res.render('index', {
    name:name,
    students:students_list
  })//enviar datos a la vista

});

// Leer el contenido del archivo de mascotas y responder
app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    
    res.send(data);
});

// API
// Obtener la lista de todas las mascotas
app.get('/api/books', (req, res) => {
    const data = readFile(FILE_NAME);
    res.render(books/index,{books:data});
    res.json(data);

});
app.get('/api/books', (req, res) => {
    const { author } = req.query;
    if (author) {
        // Filtrar las mascotas por la especie proporcionada
        const bookFilter = books.filter(book => book.especie === author);
        res.json(bookFilter);
    } else {
        // Si no se proporciona la clave "especie", devolver todas las mascotas
        res.json(books);
    }
});


app.get('/books', (req, res) => {
    const data = readFile(FILE_NAME);
    res.render('books/index',{books:data});
   

});
// crear mascota desde la web 
app.get('/books/create', (req, res) => {
    //mostrar formulario 
    res.render('books/create');
});
app.post('/books',(req,res)=>{
    try {
        const data = readFile(FILE_NAME);
        const newBook = req.body;
        newBook.id = uuidv4();
         // Generar un ID único para la mascota
        data.push(newBook);
        writeFile(FILE_NAME, data);
         // Escribir los datos actualizados en el archivo
        res.redirect('/books');
    } catch (error) {
        console.error(error);
        res.json({ message: 'error al crear libro' });
    }
});
//delete desde la web 
app.post('/books/delete/:id', (req, res) => {
    const id = req.params.id;
    const books = readFile(FILE_NAME);
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex < 0) {
        res.status(404).json({ ok: false, message: "Book not found" });
        return;
    }

    books.splice(bookIndex, 1); // Eliminar la mascota del arreglo
    writeFile(FILE_NAME, books); // Escribir los datos actualizados en el archivo
    res.redirect('/books');
});




// Crear una nueva mascota
app.post('/api/books', (req, res) => {
    try {
        const data = readFile(FILE_NAME);
        const newBook = req.body;
        newBook.id = uuidv4(); // Generar un ID único para la mascota
        data.push(newBook);
        writeFile(FILE_NAME, data); // Escribir los datos actualizados en el archivo
        res.json({ message: 'el libro fue creado exitosamente' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar libro' });
    }
});

// Obtener una sola mascota por su ID
app.get('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const books = readFile(FILE_NAME);
    const bookFound = books.find((book) => book.id === id);

    if (!bookFound) {
        res.status(404).json({ ok: false, message: "book not found" });
    }

    res.json({ ok: true, book: bookFound });
});

// Actualizar los datos de un registro de mascota
app.put('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const books = readFile(FILE_NAME);
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex < 0) {
        res.status(404).json({ ok: false, message: "book not found" });
        return;
    }

    let book = books[bookIndex];
    book = { ...book, ...req.body }; // Actualizar los datos de la mascota
    books[bookIndex] = book;
    writeFile(FILE_NAME, books); // Escribir los datos actualizados en el archivo
    res.json({ ok: true, book: book });
});

// Borrar un registro de mascota por su ID
app.delete('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const books = readFile(FILE_NAME);
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex < 0) {
        res.status(404).json({ ok: false, message: "book not found" });
        return;
    }

    books.splice(bookIndex, 1); // Eliminar la mascota del arreglo
    writeFile(FILE_NAME, books); // Escribir los datos actualizados en el archivo
    res.json({ ok: true });
});

// Iniciar el servidor y mostrar un mensaje en la consola
app.listen(PORT, () => {
    console.log(`${APP_NAME} is running on http://localhost:${PORT}`);
});

