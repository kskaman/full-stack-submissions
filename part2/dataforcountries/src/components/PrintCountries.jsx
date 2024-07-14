import ShowCountry from './ShowCountry'

const PrintCountries = ({ filteredCountries, showCountry }) => {
  

  if (filteredCountries.length > 10) {
    return <div>
      {'Too many matches, specify another filter'}
    </div>
  }

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    return <ShowCountry country={country} />
  }

  return <ul style={{listStyleType: "none", padding: 0, margin:0}}>
    {filteredCountries.map((country) => 
      <li key={country.cca3}>{country.name.common}
      <button onClick={() => showCountry(country)}>show</button></li>
      )}
    </ul>
}

export default PrintCountries