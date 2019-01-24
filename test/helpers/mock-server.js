import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'

export const host = 'http://localhost'
axios.defaults.host = host
axios.defaults.adapter = httpAdapter

export const MocksServer = {
    makeRequest({ method, url, data, query }) {
        return axios({ method, url, data, params: query })
    }
}