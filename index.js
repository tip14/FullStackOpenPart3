// IMPORTS

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')


const app = express();

morgan.token('reqbody', function (req, res) { return JSON.stringify(req.body) })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqbody'))


const persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, resp) => {
  Person.find({})
    .then(result => {
      resp.send(result)
    })
})

app.get('/api/persons/:id', (req, resp, next) => {
  const personId = req.params.id;

  Person.findById(personId)
    .then(person => {
      if (person) {
        resp.send(person);
      } else {
        resp.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.post('/api/persons', (req, resp, next) => {
  const requestBody = req.body;

  if (!requestBody.name) {
    const msg = { error: 'name is empty' }
    resp.status(400).json(msg).end();
    return;
  }

  if (!requestBody.number) {
    const msg = { error: 'number is empty' }
    resp.status(400).json(msg).end();
    return;
  }

  const newPerson = new Person({ name: requestBody.name, number: requestBody.number });

  newPerson.save()
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      resp.status(201).json(requestBody);
    })
    .catch(error => next(error))


})

app.put('/api/persons/:id', (req, resp, next) => {
  const requestBody = req.body;
  const updatedPerson = {
    number: requestBody.number
  }
  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
    .then(result => resp.json(result))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, resp) => {
  const personId = req.params.id;

  Person.findByIdAndDelete(personId).then(result => resp.end())

})


app.get('/info', (req, resp) => {
  Person.find({})
    .then(result => {
      const msq = `<p>Phonebook has info for ${result.length} people</p> <p>${new Date()}</p>`;
      resp.send(msq);
    })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)


const APP_PORT = process.env.PORT || 3001
app.listen(APP_PORT, () => {
  console.log(`Starting Express server on port ${APP_PORT}`)
})