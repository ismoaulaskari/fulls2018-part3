const express = require('express')
const app = express()

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
  const id = request.params.id
  const person = contacts.find(person => person.id === Number(id))
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

app.get('/info', (req, res) => {
  let info = `puhelinluettelossa ${contacts.length} ihmisen tiedot`
  let time = new Date();
  res.send(`<p>${info}</p><p>${time}</p>`)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

