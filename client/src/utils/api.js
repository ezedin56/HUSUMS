export const API_URL = '/api';

const getHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        'Content-Type': 'application/json',
        'Authorization': user && user.token ? `Bearer ${user.token}` : ''
    };
};

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    let payload;

    if (contentType && contentType.includes('application/json')) {
        payload = await response.json();
    } else {
        const text = await response.text();
        payload = text ? { message: text } : null;
    }

    if (!response.ok) {
        if ([401, 403].includes(response.status)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        const error = new Error(payload?.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = payload;
        throw error;
    }

    return payload;
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: getHeaders()
        });
        return handleResponse(response);
    },
    post: async (endpoint, data) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    put: async (endpoint, data) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    patch: async (endpoint, data) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    delete: async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(response);
    },
    upload: async (endpoint, formData, method = 'POST') => {
        const user = JSON.parse(localStorage.getItem('user'));
        const headers = {
            'Authorization': user && user.token ? `Bearer ${user.token}` : ''
        };
        // Don't set Content-Type for FormData, browser will set it with boundary
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: formData
        });
        return handleResponse(response);
    }
};
