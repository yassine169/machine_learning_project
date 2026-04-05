/**
 * Fake API Service to simulate Machine Learning operations
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateRandomScore(base, variance) {
    return Math.min(100, Math.max(0, base + (Math.random() * variance * 2 - variance)));
}

export const analyzeDataset = async (file) => {
    await delay(1500); // simulate parsing
    return {
        filename: file.name,
        rows: Math.floor(Math.random() * 5000) + 1000,
        columns: 6,
        preview: [
            { id: 1, age: 34, amount: 2500, duration: 12, job: 'Salarié', savings: 'Moyen', risk: 'Faible' },
            { id: 2, age: 45, amount: 8000, duration: 36, job: 'Indépendant', savings: 'Élevé', risk: 'Faible' },
            { id: 3, age: 23, amount: 1500, duration: 24, job: 'Étudiant', savings: 'Faible', risk: 'Élevé' },
            { id: 4, age: 52, amount: 12000, duration: 48, job: 'Salarié', savings: 'Élevé', risk: 'Faible' },
            { id: 5, age: 29, amount: 4500, duration: 18, job: 'Chômage', savings: 'Faible', risk: 'Élevé' }
        ],
        features: ['age', 'amount', 'duration', 'job', 'savings']
    };
};

export const trainModel = async (modelId, params, clientData) => {
    // Simulate multi-step progress (Loading -> Training -> Evaluation)
    // We'll just return the final simulated result, UI will handle progress steps.

    await delay(3000); // 3 seconds total simulation

    const bases = {
        'lr': 82,
        'rf': 91,
        'svm': 88,
        'knn': 84
    };

    const baseAcc = bases[modelId] || 85;
    const accuracy = parseFloat(generateRandomScore(baseAcc, 4).toFixed(2));
    const f1 = parseFloat((accuracy - Math.random() * 3).toFixed(2));

    // Fake prediction based on clientData simple heuristic
    let isRisky = false;
    if (clientData) {
        if ((clientData.amount > 10000 && clientData.savings === 'Faible') || clientData.job === 'Chômage') {
            isRisky = true;
        }
    } else {
        isRisky = Math.random() > 0.7;
    }

    const probability = isRisky ? generateRandomScore(85, 10) : generateRandomScore(15, 10);

    return {
        id: Date.now().toString(),
        modelId,
        params,
        metrics: {
            accuracy,
            f1Score: f1,
            precision: parseFloat((accuracy + 1).toFixed(2)),
            recall: parseFloat((f1 - 1).toFixed(2)),
        },
        prediction: {
            class: isRisky ? 'Client à risque' : 'Bon profil',
            isRisky: isRisky,
            probability: parseFloat(probability.toFixed(1))
        },
        confusionMatrix: [
            { name: 'Prédit: Bon', 'Réel: Bon': Math.floor(400 * (accuracy / 100)), 'Réel: Mauvais': Math.floor(100 * ((100 - accuracy) / 100)) },
            { name: 'Prédit: Mauvais', 'Réel: Bon': Math.floor(400 * ((100 - accuracy) / 100)), 'Réel: Mauvais': Math.floor(100 * (accuracy / 100)) }
        ],
        rocData: Array.from({ length: 10 }).map((_, i) => ({
            fpr: i / 9,
            tpr: Math.min(1, (i / 9) * (accuracy / 50))
        })),
        timestamp: new Date().toISOString()
    };
};

export const runAutoML = async (clientData) => {
    await delay(5000); // takes longer

    const models = ['lr', 'rf', 'svm', 'knn'];
    const results = await Promise.all(models.map(m => trainModel(m, {}, clientData)));

    // sort by accuracy
    results.sort((a, b) => b.metrics.accuracy - a.metrics.accuracy);

    return {
        bestModel: results[0],
        allResults: results
    };
};
