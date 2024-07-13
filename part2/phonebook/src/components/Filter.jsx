const Filter = ({ searchName, handleSearch }) => {
  return (
    <div>
      <label htmlFor="search">filter shown with:</label>
      <input 
        id="search"
        value={searchName}
        onChange={handleSearch}  
      />
    </div>
  )
}

export default Filter
