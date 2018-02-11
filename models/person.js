const mongoose = require('mongoose')
const Schema = mongoose.Schema;
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

personSchema.statics.get = (id) => Person.findById(id)

personSchema.statics.getAll = () => Person.find({})

personSchema.statics.create = (person) => {
    person = new Person(person)
    return person.save()
}

personSchema.statics.remove = (id) => Person.findByIdAndRemove(id)

const Person = mongoose.model('Person', personSchema)

module.exports = Person
