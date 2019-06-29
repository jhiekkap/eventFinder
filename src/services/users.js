import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => { 

  /* const config = {
    headers: { Authorization: token },
  } */
  const response = await axios.post(baseUrl, newObject) ///tässä olisi config 3.param
  return response.data
}

const update = (newObject) => {
  const request = axios.put(baseUrl, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken }