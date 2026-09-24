const backend_api_url = import.meta.env.VITE_API_BACKEND_URL || '';

// Ensure base URL ends cleanly without double slashes
const baseUrl = backend_api_url.endsWith('/') ? backend_api_url.slice(0, -1) : backend_api_url;

export const getCoordinates = {
    getCountry: async () => {
        const response = await fetch(`${baseUrl}/countries/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch countries. Status: ${response.status}`);
        }
        return await response.json();
    },

    getState: async (country_id) => {
        const response = await fetch(`${baseUrl}/countries/${country_id}/states/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch states. Status: ${response.status}`);
        }
        return await response.json();
    },

    // Renamed from getCity to getStateCity to match your useStateCity hook
    getStateCity: async (state_id) => {
        const response = await fetch(`${baseUrl}/states/${state_id}/cities/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cities. Status: ${response.status}`);
        }
        return await response.json();
    }
};