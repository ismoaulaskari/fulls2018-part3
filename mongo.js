const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.DB_URL

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length !== 4) {
  if (process.argv.length === 2) {
    const formatPerson = (person) => console.log(`${person.name} ${person.number}`) 

    mongoose.connect(url)
    Person
      .find({})
      .then(person => {
        console.log('Puhelinluettelo:')
        person.map(formatPerson)
        mongoose.connection.close()
      })
  }
  else {
    console.log(`usage: node ${process.argv[1]} "name" number`)
  }
}
else {
  mongoose.connect(url)

  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
      mongoose.connection.close()
    })
}
