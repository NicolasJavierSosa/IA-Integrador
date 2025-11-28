const API_URL = 'http://localhost:8000/api';

export const client = {
    request: async (endpoint, options = {}) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        // Return null for 204 No Content
        if (response.status === 204) return null;

        return response.json();
    }
};
