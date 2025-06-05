import axios from 'axios'
import { getToken } from '../utils/helpers/storage'

export const useApi = () => {

    const request =
        async <T>(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any): Promise<T> => {
            try {
                const token = getToken()
                const response = await axios.request<T>({
                    method,
                    url,
                    data,
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                })
                return response.data
            } catch (error: any) {
                throw error.response?.data || { message: 'Unknown error occurred' }
            }
        }

    return {
        get: <T>(url: string) => request<T>('get', url),
        post: <T>(url: string, data: any) => request<T>('post', url, data),
        put: <T>(url: string, data: any) => request<T>('put', url, data),
        del: <T>(url: string) => request<T>('delete', url),
    }
}
