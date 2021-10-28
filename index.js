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

app.get('/api/persons/:id', (req, resp) => {
  const personId = req.params.id;
  const byPersonId = persons.find(p => p.id == personId)

  if (byPersonId) {
    resp.send(byPersonId);
  } else {
    resp.status(404).end()
  }
})

app.post('/api/persons', (req, resp) => {
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

  newPerson.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
  })

  resp.status(201).json(requestBody);
})

app.delete('/api/persons/:id', (req, resp) => {
  const personId = req.params.id;
  for (let i = 0; i < persons.length; i++) {
    if (persons[i].id == personId) {
      persons.splice(i, 1);
    }
  }
  resp.end();
})


app.get('/info', (req, resp) => {
  const msq = `<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`;
  resp.send(msq);
})




const APP_PORT = process.env.PORT || 3001
app.listen(APP_PORT, () => {
  console.log(`Starting Express server on port ${APP_PORT}`)
})