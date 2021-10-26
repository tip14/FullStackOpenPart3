const express = require('express')
const app = express();

app.use(express.json())

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
    resp.send(persons);
})

app.get('/api/persons/:id', (req, resp) => {
  const personId = req.params.id;
  const byPersonId = persons.find(p => p.id == personId)

  if(byPersonId){
    resp.send(byPersonId);
  } else {
    resp.status(404).end()
  }
})

app.post('/api/persons', (req, resp) => {
  const newPerson = req.body;
  
  if(!newPerson.name) {
    const msg = { error: 'name is empty' }
    resp.status(400).json(msg).end();
    return;
  }

  if(!newPerson.number) {
    const msg = { error: 'number is empty' }
    resp.status(400).json(msg).end();
    return;
  }

  if(persons.filter(p => p.name === newPerson.name).length > 0) {
    const msg = { error: 'name must be unique' }
    resp.status(400).json(msg).end();
    return;
  }



  newPerson.id = Math.floor(Math.random() * 1000);
  persons.push(newPerson)
  resp.status(201).json(newPerson);
})

app.delete('/api/persons/:id', (req, resp) => {
  const personId = req.params.id;
  for(let i = 0; i < persons.length; i++) {
    if(persons[i].id == personId) {
      persons.splice(i, 1); 
    }
  }
  resp.end();
})


app.get('/info', (req, resp) => {
  const msq = `<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`;
  resp.send(msq);
})




const APP_PORT = 3001
app.listen(APP_PORT, () => {
  console.log(`Starting Express server on port ${APP_PORT}`)
})