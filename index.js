const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

let contacts = []

app.get('/', (req, res) => {
  res.send('<h1>Phonebook!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  //if (!mongoose.Types.ObjectId.isValid(id)) 
  if (!id.match(/^[0-9a-fA-F]{24}$/)) return response.status(400).json({ error: 'bad objectId' })

  const person = Person.get(id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons', (request, response) => {
  Person.getAll()
    .then((persons) => {
      if (persons) {
        response.json(persons.map(Person.format))
      }
      else {
        response.json([])
      }
    })
    .catch(error => {
      console.log("On getAll()", error)
      return response.status(500).json({ error: 'cannot get persons' })
    })
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  console.log("POST", person)

  if (person.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (person.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const formatted = Person.format(person)
  Person.create(formatted)
    .then((res) => {
      const saved = Person.find({ name: person.name })
        .then(p => p.map(Person.format))
        .then(p => {
          contacts = contacts.concat(p)
          response.json(p)
        })
        .catch(error => {
          console.log(error)
          return response.status(500).json({ error: 'saving failed' })
        })
    })
})

app.put('/api/persons', (req, res) => {
  const person = req.body

  if (person.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }
  if (person.number === undefined) {
    return res.status(400).json({ error: 'number missing' })
  }

  const existing = contacts.find(p => p.name === person.name)
  if (existing) {
    existing.number = person.number
    res.json(existing)
  }
  else {
    return res.status(404)
  }

})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.remove(id)
    .then(result => {
      contacts = contacts.filter(person => person.id !== id)
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (req, res) => {
  let info = `puhelinluettelossa ${contacts.length} ihmisen tiedot`
  let time = new Date();
  res.send(`<p>${info}</p><p>${time}</p>`)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

