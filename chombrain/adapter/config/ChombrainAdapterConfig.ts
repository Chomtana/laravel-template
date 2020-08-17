import axios from 'axios'

export var api = axios.create({
  baseURL: "127.0.0.1:8000/api"
})