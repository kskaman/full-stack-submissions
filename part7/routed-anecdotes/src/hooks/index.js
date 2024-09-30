import { useState, useEffect } from 'react'
import axios from 'axios'

// Hook for managing form fields
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset,
    fieldProps: {
      type,
      value,
      onChange
    }
  }
}

// Hook for fetching country data
export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name) {
      axios
        .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
        .then(response => {
          if (response.data.length > 0) {
            setCountry(response.data[0])
          } else {
            setCountry(null)
          }
        })
        .catch(() => setCountry(null))
    }
  }, [name])

  return country
}

// Hook for managing resources (e.g., notes, persons)
export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setResources(response.data)
    })
  }, [baseUrl])

  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then(response => {
        setResources(resources.concat(response.data))
      })
  }

  const service = {
    create
  }

  return [resources, service]
}
