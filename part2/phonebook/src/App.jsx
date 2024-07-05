import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'


const App = () => {

  const [persons, setPersons] = useState([])  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  
  
  const hook = () => {
    axios.
      get('http://localhost:3001/persons').
      then(response => {
      setPersons(response.data)
    })
  }
  useEffect(hook, [])


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

    setPersons(persons.concat({name : newName.trim(), number: newNumber.trim(), id: "${index}"}))
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