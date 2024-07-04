const Persons = ({filteredPersons}) => {
    return <ul type="none" style={{paddingLeft:0}}>
          {filteredPersons.map((person, index) => 
            <li key={index}>{person.name} {person.number}</li>)}
        </ul>
  }

export default Persons