const Persons = ({ filteredPersons, deleteContact }) => {
  return (
    <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
      {filteredPersons.map(person => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deleteContact(person)}>delete</button>
        </li>
      ))}
    </ul>
  )
}

export default Persons
