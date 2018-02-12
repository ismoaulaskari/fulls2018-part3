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
        const newPersons = persons.map(Person.format)        
        response.json(newPersons)
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
          response.json(p)
        })
        .catch(error => {
          console.log(error)
          return response.status(500).json({ error: 'saving failed' })
        })
    })
})

app.put('/api/persons', (request, response) => {
  const person = request.body
  console.log("PUT", person)

  if (person.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (person.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }
  
  Person.get(person.id)
    .then(found => Person.format(found))
    .then(existing => {
      if (existing) {        
        existing.number = person.number
        Person.updateId(existing)
          .then(updatedPerson => {
            if (updatedPerson) {
              response.json(Person.format(updatedPerson))
            }
            else {
              response.json({})
            }
          })
          .catch(error => {
            console.log(error)
            return response.status(500).json({ error: 'update failed' })
          })
      }
      else {
        return response.status(404).end()
      }
    })
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.remove(id)
    .then(result => {      
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (req, res) => {
  let info = `puhelinluettelossa ${Person.getAll().length} ihmisen tiedot`
  let time = new Date();
  res.send(`<p>${info}</p><p>${time}</p>`)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

