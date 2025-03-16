import axios from 'axios';

const API_URL = 'http://localhost:3000/api';  // Use your local IP for physical devices

export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const addUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/users`, user);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};
