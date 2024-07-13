import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import getData from "./services/numbers"
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

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
    person.name?.toLowerCase().includes(searchName.toLowerCase())
  )

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
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
          getData.update({ ...oldPerson, number: newNumber.trim() })
          .then((returnedPerson) => {
            setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated ${newName}`, type: 'success' })
            setTimeout(() => {
              setNotification({ message: null, type: '' })
            }, 5000)
          })
          .catch((error) => {
            if (error.response.status === 404) {
              if (window.confirm(`${newName} was deleted from server. Do you want to add it ?`)) {
                getData.create(newPerson)
                .then((data) => {
                  setPersons(persons.concat(data))
                  setNewName('')
                  setNewNumber('')
                  setNotification({ message: `Updated ${newName}`, type: 'success' })
                  setTimeout(() => {
                    setNotification({ message: null, type: '' })
                  }, 5000)
                  console.clear()
                })
              }
            } else {
              setNotification({ message: `Error updating person: ${error.name}`, type: 'error' })
              setTimeout(() => {
                setNotification({ message: null, type: '' })
              }, 5000)
            }
          })
        }
      return
    }

    getData.create(newPerson)
    .then((data) => {
      setPersons(persons.concat(data))
      setNewName('')
      setNewNumber('')
      setNotification({ message: `Added ${data.name}`, type: 'success' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    })
    .catch((error) => {
      setNotification({ message: `Error adding person: ${error.name}`, type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: '' })
      }, 5000)
    })
  }

  const deleteContact = async (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      getData.del(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setNotification({ message: `Deleted ${person.name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
        .catch(error => {
          if (error.response.status === 404) {
            setNotification({ message: `Information of ${person.name} has already been removed from server`, type: 'error' })
            setTimeout(() => {
              setNotification({ message: null, type: '' })
            }, 5000)
            console.clear()
            setPersons(persons.filter(p => p.id !== person.id))
          } else {
            alert(`${error.name} error occured.`)
          }
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
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
