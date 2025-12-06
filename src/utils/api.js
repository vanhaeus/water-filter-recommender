import mockData from '../data/mock_database.json';

// EPA Envirofacts API Base URL (Example - requires specific table knowledge)
// For this demo, we will structure the fetch but default to mock data 
// because the EPA API requires complex table joins and specific row IDs.
export const fetchWaterQuality = async (zipCode) => {
    try {
        const response = await fetch(`/api/water-quality?zip=${zipCode}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching water quality data:", error);
        return null;
    }
};
