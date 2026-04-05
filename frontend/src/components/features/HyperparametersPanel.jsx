import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input, Label } from '../ui/Input';
import { Settings2 } from 'lucide-react';

const HYPER_PARAMS_SCHEMA = {
    'lr': [
        { name: 'C (Inverse de régularisation)', id: 'C', type: 'number', default: 1.0, min: 0.01, step: 0.1 },
        { name: 'Max Iterations', id: 'max_iter', type: 'number', default: 100, min: 50, step: 10 }
    ],
    'rf': [
        { name: 'Nombre d\'arbres (n_estimators)', id: 'n_estimators', type: 'number', default: 100, min: 10, step: 10 },
        { name: 'Profondeur Max (max_depth)', id: 'max_depth', type: 'number', default: 10, min: 1, step: 1 }
    ],
    'svm': [
        { name: 'C (Régularisation)', id: 'C', type: 'number', default: 1.0, min: 0.1, step: 0.1 },
        { name: 'Kernel', id: 'kernel', type: 'select', options: ['rbf', 'linear', 'poly'] }
    ],
    'knn': [
        { name: 'Nombre de Voisins (k)', id: 'k', type: 'number', default: 5, min: 1, step: 1 },
        { name: 'Poids (weights)', id: 'weights', type: 'select', options: ['uniform', 'distance'] }
    ]
};

export default function HyperparametersPanel({ selectedModels, params, setParams }) {
    if (selectedModels.length !== 1) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        Hyperparamètres
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Veuillez sélectionner un seul modèle pour configurer ses paramètres.</p>
                </CardHeader>
                <CardContent className="h-32 flex items-center justify-center border-t border-border/50 bg-background/20 opacity-50">
                    <Settings2 className="w-12 h-12 text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    const modelId = selectedModels[0];
    const schema = HYPER_PARAMS_SCHEMA[modelId];

    const handleChange = (e, paramId) => {
        setParams(prev => ({
            ...prev,
            [modelId]: {
                ...(prev[modelId] || {}),
                [paramId]: e.target.value
            }
        }));
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    Hyperparamètres
                </CardTitle>
                <p className="text-sm text-muted-foreground">Ajustez les valeurs pour le modèle sélectionné</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {schema.map(param => {
                    const val = (params[modelId] && params[modelId][param.id]) || param.default;

                    return (
                        <div key={param.id} className="space-y-2">
                            <Label htmlFor={param.id} className="text-sm text-foreground/80">{param.name}</Label>
                            {param.type === 'select' ? (
                                <select
                                    id={param.id}
                                    value={val}
                                    onChange={(e) => handleChange(e, param.id)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    {param.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex gap-4 items-center">
                                    <Input
                                        type="range"
                                        id={`${param.id}-slider`}
                                        value={val}
                                        min={param.min || 0}
                                        max={(param.min || 0) + (param.step || 1) * 50}
                                        step={param.step}
                                        onChange={(e) => handleChange(e, param.id)}
                                        className="flex-1 accent-primary"
                                    />
                                    <Input
                                        type="number"
                                        id={param.id}
                                        value={val}
                                        min={param.min}
                                        step={param.step}
                                        onChange={(e) => handleChange(e, param.id)}
                                        className="w-24 text-center font-mono"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
