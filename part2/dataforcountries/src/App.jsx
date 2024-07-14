import getData from './services/database'
import { useState, useEffect } from 'react'
import PrintCountries from './components/PrintCountries'


const App = () => {
  const [countries, setCountries] = useState([])
  const [searchName, setSearchName] = useState('')
  
  useEffect(() => {
    getData.getAll()
    .then(data => {
      setCountries(data)
    })
    .catch(error => {
      alert(`Error fetching data: ${error}`)
    })
  }, [])

  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(searchName.toLowerCase())
  )

  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  const showCountry = (country) => {
    setSearchName(country.name.common)
  }

  return <div>
    <form>
      <label htmlFor="countryName">find countries</label>
      <input 
        id="countryName"
        value={searchName}
        onChange={handleSearch}
      />
    </form>
    {searchName && <PrintCountries filteredCountries={filteredCountries} showCountry={showCountry}/>}
  </div>
}

export default App