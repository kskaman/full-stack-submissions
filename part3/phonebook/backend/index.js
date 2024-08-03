const express = require('express');
const morgan = require('morgan')

const app = express();



app.use(express.static('dist'))


// Custom token to log request body for POST requests
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));




require('dotenv').config()

const Person = require('./models/person')





// let persons = [
//     { 
//       id: "1",
//       name: "Arto Hellas", 
//       number: "040-123456"
//     },
//     { 
//       id: "2",
//       name: "Ada Lovelace", 
//       number: "39-44-5323523"
//     },
//     { 
//       id: "3",
//       name: "Dan Abramov", 
//       number: "12-43-234345"
//     },
//     { 
//       id: "4",
//       name: "Mary Poppendieck", 
//       number: "39-23-6423122"
//     }
// ]


const cors = require('cors')
app.use(cors())

app.use(express.json());

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {    
    response.json(persons);
  })
})

app.get('/info', (request, response) => {
    Person.countDocuments({})
    .then(count => {
        const date = new Date()
        response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${date}</p>
        `)
    })
    .catch(error => {
        console.error('Error fetching count : ', error)
        response.status(500).send('<p>Error retreiving information from the database.</p>')
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => response.status(404).end())
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => response.status(400).send(`<p>${error} encountered.</p>`))
})


app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    }

    Person.findOne({name: name })
    .then(existingName => {
        if (existingName) {
            return response.status(404).json({
                error: 'Name must be unique'
            })
        } else {
            const person = {
                name: body.name,
                number: body.number,
            };
        
            Person.save().then(savedPerson => {
                response.json(person)
            })
        }
    })
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndPoint);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
