// Utility to get full image URL
export const getPhotoUrl = (path) => {
    if (!path) return null;

    // If it's already a full URL or data URI, return as is
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    // Get API base URL and remove '/api' if present to get server root
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const serverUrl = apiUrl.replace(/\/api$/, '');

    // Ensure path starts with / if not present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${serverUrl}${cleanPath}`;
};
