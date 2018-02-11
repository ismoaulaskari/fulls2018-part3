const mongoose = require('mongoose')
var Schema = mongoose.Schema;
require('dotenv').config()

const url = process.env.DB_URL

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new Schema({
    name: String,
    number: String,
    id: String
})

personSchema.statics.format = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}
personSchema.statics.getAll = () => {
    Person
        .find({})
        .then(persons => persons.map(Person.format))
        .catch(error => {
            console.log(error)
        })

}
personSchema.statics.create = (person) => {
    person = new Person(person)
    person.save()
        .then(response => {
            //console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)            
        }).catch(error => {
            console.log(error)
        })
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person
