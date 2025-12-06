import { getWaterQuality } from './epaManager';
import mockData from '../data/mock_database.json';

export const getWaterData = async (zip) => {
    if (!zip) return null;

    try {
        // 1. Try Real EPA API
        const realData = await getWaterQuality(zip);

        if (realData) {
            return realData;
        }

        // 2. Fallback to Mock Data
        console.log(`EPA API returned no data for ${zip}, falling back to mock data.`);
        const mockResult = mockData.find(entry => entry.zipCode === zip);

        if (mockResult) {
            return mockResult;
        }

        return null;

    } catch (error) {
        console.error('Data Fetcher Error:', error);
        return null;
    }
};
