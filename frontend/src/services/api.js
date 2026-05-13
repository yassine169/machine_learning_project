import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000'
});

export const analyzeDataset = async (file) => {
    const response = await api.post('/analyze');
    return response.data;
};

export const trainModel = async (modelId, params, clientData) => {
    const payload = {
        age: clientData.age || 35,
        amount: clientData.amount || 5000,
        duration: clientData.duration || 24,
        job: clientData.job || 'Salarié',
        savings: clientData.savings || 'Moyen'
    };
    
    const response = await api.post(`/train/${modelId}`, payload);
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data;
};

export const runAutoML = async (clientData) => {
    const payload = {
        age: clientData.age || 35,
        amount: clientData.amount || 5000,
        duration: clientData.duration || 24,
        job: clientData.job || 'Salarié',
        savings: clientData.savings || 'Moyen'
    };
    const response = await api.post('/automl', payload);
    if (response.data.error) {
        throw new Error(response.data.error);
    }
    return response.data;
};
