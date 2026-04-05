import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BrainCircuit, Info } from 'lucide-react';

const MODELS = [
    { id: 'lr', name: 'Régression Logistique', desc: 'Modèle linéaire simple, interprétable et rapide.' },
    { id: 'rf', name: 'Random Forest', desc: 'Ensemble d\'arbres de décision, robuste et performant.' },
    { id: 'svm', name: 'SVM', desc: 'Séparation par marge maximale, efficace pour les frontières nettes.' },
    { id: 'knn', name: 'K-Nearest Neighbors', desc: 'Classification basée sur les x plus proches voisins.' }
];

export default function ModelSelector({ selectedModels, toggleModel, multiSelect = false }) {

    const handleSelect = (id) => {
        if (multiSelect) {
            if (selectedModels.includes(id)) {
                toggleModel(selectedModels.filter(m => m !== id));
            } else {
                toggleModel([...selectedModels, id]);
            }
        } else {
            toggleModel([id]);
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    Sélection du Modèle
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {multiSelect ? 'Sélectionnez plusieurs modèles à comparer' : 'Choisissez le modèle de Machine Learning'}
                </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MODELS.map(model => {
                    const isSelected = selectedModels.includes(model.id);
                    return (
                        <div
                            key={model.id}
                            onClick={() => handleSelect(model.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                                    : 'border-border bg-background/50 hover:bg-secondary/50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-foreground text-sm">{model.name}</span>
                                <div className="group relative">
                                    <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                    <div className="absolute top-6 right-0 w-48 p-2 bg-popover text-popover-foreground border rounded-md shadow-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                        {model.desc}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-xs font-medium">
                                <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]' : 'bg-muted-foreground/30'}`} />
                                <span className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                                    {isSelected ? 'Sélectionné' : 'Inactif'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
