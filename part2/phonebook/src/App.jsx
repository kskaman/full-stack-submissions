import { useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  
  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  
  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(searchName.toLowerCase())
  )


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    if (newName.trim() === '') {
      return
    }
    if (newNumber.trim() === '') {
      return
    }

    if (persons.some(person => person.name.toLowerCase() === newName.trim().toLowerCase())) {
      alert(newName + ' is already added to your phonebook')
      return
    }

    setPersons(persons.concat({name : newName.trim(), number: newNumber.trim()}))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter searchName={searchName} handleSearch={handleSearch}/>
      
      <h2>add a new</h2>
      
      <PersonForm 
        addName={addName} 
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNewNumber={handleNewNumber}
      />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App