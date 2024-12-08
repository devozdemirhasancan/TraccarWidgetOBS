const TraccarService = {
    async fetchPositions(apiUrl, token, deviceId) {
        const response = await fetch(`${apiUrl}/positions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Konum verisi çekilemedi');
        return response.json();
    }
};

export default TraccarService; // Use default export