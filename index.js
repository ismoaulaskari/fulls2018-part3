const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

let contacts = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  },
  {
    "name": "urho kekkekon",
    "number": "59585",
    "id": 6
  },
  {
    "id": 8,
    "name": "hang",
    "number": "666"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = contacts.find(person => person.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.get('/api/persons', (req, res) => {
  res.json(contacts)
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  if (person.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }
  if (person.number === undefined) {
    return res.status(400).json({error: 'number missing'})
  }

  const existing = contacts.find(p => p.name === person.name)
  if(existing) {
    return res.status(400).json({error: 'already exists'})
  }

  person.id = Math.floor(Math.random() * 1000000)
  contacts = contacts.concat(person)
  res.json(person)
})

app.put('/api/persons', (req, res) => {
  const person = req.body

  if (person.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }
  if (person.number === undefined) {
    return res.status(400).json({error: 'number missing'})
  }

  const existing = contacts.find(p => p.name === person.name)
  if(existing) {
    existing.number = person.number  
    res.json(existing)
  }
  else {
    return res.status(404)
  }
  
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (req, res) => {
  let info = `puhelinluettelossa ${contacts.length} ihmisen tiedot`
  let time = new Date();
  res.send(`<p>${info}</p><p>${time}</p>`)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

