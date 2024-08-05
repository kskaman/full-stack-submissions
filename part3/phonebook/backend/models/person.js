const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'Name must be at least 3 characters long'],
      required: true 
    },
    number: {
      type : String,
      required: true,
      validate: {
        validator: function(v) {
          return /(\d{2,3}-\d+)/.test(v); // validates the phone number format
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  })

module.exports = mongoose.model('Person', personSchema)