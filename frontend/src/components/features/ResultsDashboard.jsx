import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BarChart, Activity, PieChart } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    LineChart,
    Line,
    ReferenceLine
} from 'recharts';

export default function ResultsDashboard({ result }) {
    if (!result) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-primary" />
                        Résultats du Modèle
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Aucun résultat à afficher pour le moment.</p>
                </CardHeader>
                <CardContent className="h-64 flex flex-col items-center justify-center border-t border-border/50 bg-background/20 opacity-50">
                    <PieChart className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">Lancez un entraînement pour voir les KPIs</p>
                </CardContent>
            </Card>
        );
    }

    const { metrics, prediction, confusionMatrix, rocData } = result;

    return (
        <Card className="h-full glass-panel border-primary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary animate-pulse" />
                    Résultats de l'Évaluation
                </CardTitle>
                <p className="text-sm text-muted-foreground">Simulation d'inférence et performances</p>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* Top KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KpiCard title="Accuracy" value={`${metrics.accuracy}%`} />
                    <KpiCard title="F1-Score" value={metrics.f1Score} />
                    <KpiCard title="Précision" value={metrics.precision} />
                    <KpiCard title="Rappel" value={metrics.recall} />
                </div>

                {/* Prediction Box */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${prediction.isRisky ? 'bg-destructive/10 border-destructive' : 'bg-emerald-500/10 border-emerald-500'}`}>
                    <div>
                        <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Prédiction du Profil</div>
                        <div className={`text-xl font-bold ${prediction.isRisky ? 'text-destructive' : 'text-emerald-500'}`}>
                            {prediction.class}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Probabilité</div>
                        <div className="text-xl font-mono font-bold text-foreground">
                            {prediction.probability}%
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

                    {/* Confusion Matrix (Mocked via BarChart) */}
                    <div className="bg-secondary/20 p-4 rounded-xl border">
                        <h4 className="text-sm font-semibold mb-4 text-center text-muted-foreground">Matrice de Confusion</h4>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={confusionMatrix} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                                    <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#888', fontSize: 12 }} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #333', borderRadius: '8px' }} />
                                    <Bar dataKey="Réel: Bon" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Réel: Mauvais" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ROC Curve */}
                    <div className="bg-secondary/20 p-4 rounded-xl border">
                        <h4 className="text-sm font-semibold mb-4 text-center text-muted-foreground">Courbe ROC</h4>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={rocData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                                    <XAxis dataKey="fpr" tick={{ fill: '#888', fontSize: 12 }} type="number" domain={[0, 1]} />
                                    <YAxis dataKey="tpr" tick={{ fill: '#888', fontSize: 12 }} type="number" domain={[0, 1]} />
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #333', borderRadius: '8px' }} formatter={(v) => v.toFixed(2)} />
                                    <ReferenceLine stroke="#888" strokeDasharray="3 3" segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} />
                                    <Line type="monotone" dataKey="tpr" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

            </CardContent>
        </Card>
    );
}

function KpiCard({ title, value }) {
    return (
        <div className="bg-secondary/30 border p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{title}</div>
            <div className="text-lg font-bold font-mono text-primary">{value}</div>
        </div>
    );
}
