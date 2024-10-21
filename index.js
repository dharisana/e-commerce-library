import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from './models/bookModel.js';

const app = express();
app.use(express.json()); // To parse JSON body in requests

app.get('/', (request, response) => {
   console.log(request);
   return response.status(234).send("Welcome to mern stack");
});

// Route to save a new book
app.post('/books', async (request, response) => {
   try {
      if (
         !request.body.title ||
         !request.body.author ||
         !request.body.publishYear
      ) {
         return response.status(400).send({
            message: 'Send all the required fields: title, author, publishYear',
         });
      }

      const newBook = {
         title: request.body.title,
         author: request.body.author,
         publishYear: request.body.publishYear, // Corrected the typo here
      };

      const book = await Book.create(newBook);
      response.status(201).send(book); // To send a response after successfully saving the book
   } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
   }
});

mongoose
   .connect(mongoDBURL)
   .then(() => {
      console.log("App connected to DB");
      app.listen(PORT, () => {
         console.log(`The app is listening on port: ${PORT}`);
      });
   })
   .catch((error) => {
      console.log("App failed to connect to DB", error.message); // Added error message in catch block
   });
