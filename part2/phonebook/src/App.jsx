import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import getData from "./services/numbers"

const App = () => {
  const [persons, setPersons] = useState([])  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    getData.getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons)
      })
      .catch(error => {
        alert('Error fetching data:', error)
      })
  }, [])

  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(searchName.toLowerCase())
  )

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = async (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName.trim(),
      number: newNumber.trim()  
    }

    if (!newPerson.name || !newPerson.number) {
      alert('Name and number cannot be empty')
      return
    }

    const oldPerson = persons.find(person => person.name.toLowerCase() === newName.trim().toLowerCase())
    
    if (oldPerson) {
      if (window.confirm(`${newName} is already added to your phonebook, replace the old number with a new one?`)) {
        try {
          const returnedPerson = await getData.update({ ...oldPerson, number: newNumber.trim() })
          setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
        } catch (error) {
          alert(`Error updating person: ${error}`)
        }
      }
      return
    }

    try {
      const data = await getData.create(newPerson)
      setPersons(persons.concat(data))
      setNewName('')
      setNewNumber('')
    } catch (error) {
      alert(`Error adding person: ${error}`)
    }
  }

  const deleteContact = async (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      try {
        await getData.del(person.id)
        setPersons(persons.filter(p => p.id !== person.id))
      } catch (error) {
        alert(`Error deleting person: ${error}`)
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} handleSearch={handleSearch} />
      <h2>Add a new</h2>
      <PersonForm 
        addName={addName} 
        newName={newName} handleNameChange={handleNewName}
        newNumber={newNumber} handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deleteContact={deleteContact} />
    </div>
  )
}

export default App
