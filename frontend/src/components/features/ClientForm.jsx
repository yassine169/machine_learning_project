import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input, Label } from '../ui/Input';
import { UserCheck } from 'lucide-react';

export default function ClientForm({ clientData, setClientData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    Profil Client (Test)
                </CardTitle>
                <p className="text-sm text-muted-foreground">Saisissez les données pour tester le modèle prédictif</p>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="age">Âge</Label>
                    <Input
                        id="age" name="age" type="number"
                        placeholder="Ex: 34"
                        value={clientData.age} onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount">Montant du Crédit (€)</Label>
                    <Input
                        id="amount" name="amount" type="number"
                        placeholder="Ex: 5000"
                        value={clientData.amount} onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="duration">Durée (Mois)</Label>
                    <Input
                        id="duration" name="duration" type="number"
                        placeholder="Ex: 24"
                        value={clientData.duration} onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="job">Situation Professionnelle</Label>
                    <select
                        id="job" name="job"
                        value={clientData.job} onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Salarié">Salarié</option>
                        <option value="Indépendant">Indépendant</option>
                        <option value="Chômage">Sans emploi</option>
                        <option value="Étudiant">Étudiant</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="savings">Niveau d'Épargne</Label>
                    <select
                        id="savings" name="savings"
                        value={clientData.savings} onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Faible">Faible (Moins de 1000€)</option>
                        <option value="Moyen">Moyen (1000€ - 5000€)</option>
                        <option value="Élevé">Élevé (Plus de 5000€)</option>
                    </select>
                </div>

            </CardContent>
        </Card>
    );
}
