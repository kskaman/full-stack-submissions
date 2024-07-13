const PersonForm = ({ newName, handleNameChange, newNumber, handleNewNumber, addName }) => {
  return (
    <form onSubmit={addName}>
      <div>
        <label htmlFor="name">name:</label>
        <input 
          id="name"
          value={newName}
          onChange={handleNameChange}
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="number">number:</label>
        <input 
          id="number"
          value={newNumber}
          onChange={handleNewNumber}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>  
  )
}

export default PersonForm
