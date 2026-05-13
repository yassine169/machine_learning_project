import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table } from 'lucide-react';

export default function DataPreview({ dataset }) {
    if (!dataset) return null;

    return (
        <Card className="mb-6 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Table className="w-5 h-5 text-primary" />
                    Aperçu des Données (Preview)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {dataset.rows} lignes • {dataset.columns} colonnes
                </p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                    <thead className="text-xs text-foreground uppercase bg-secondary/50">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg">ID</th>
                            <th className="px-4 py-3">Âge</th>
                            <th className="px-4 py-3">Montant</th>
                            <th className="px-4 py-3">Durée (mois)</th>
                            <th className="px-4 py-3">Emploi</th>
                            <th className="px-4 py-3">Épargne</th>
                            <th className="px-4 py-3 rounded-tr-lg">Risque (Target)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataset.preview.map((row, i) => (
                            <tr key={i} className="border-b border-border hover:bg-secondary/20 transition-colors">
                                <td className="px-4 py-2 font-medium text-foreground">{row.id}</td>
                                <td className="px-4 py-2">{row.age}</td>
                                <td className="px-4 py-2">{row.amount} €</td>
                                <td className="px-4 py-2">{row.duration}</td>
                                <td className="px-4 py-2">{row.job}</td>
                                <td className="px-4 py-2">{row.savings}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${row.risk === 'Faible' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                                        {row.risk}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-3 text-center text-xs text-muted-foreground italic">
                    Affichage des 5 premières lignes seulement...
                </div>
            </CardContent>
        </Card>
    );
}
