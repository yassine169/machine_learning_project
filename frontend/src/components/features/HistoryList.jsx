import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { History, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export default function HistoryList({ history, clearHistory }) {
    if (!history || history.length === 0) return null;

    return (
        <Card className="mb-6 glass-panel border-primary/20 relative overflow-hidden">
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <History className="w-5 h-5 text-primary" />
                    Historique des entraînements
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive h-8 px-2">
                    <XCircle className="w-4 h-4 mr-2" />
                    Effacer
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mt-4">
                    {history.map((run, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-all">
                            <div>
                                <div className="font-semibold text-foreground capitalize">{run.modelId.replace('lr', 'Logistic Reg.').replace('rf', 'Random Forest').toUpperCase()}</div>
                                <div className="text-xs text-muted-foreground">{new Date(run.timestamp).toLocaleTimeString()}</div>
                            </div>
                            <div className="flex gap-4 text-sm text-right">
                                <div>
                                    <div className="text-muted-foreground text-xs uppercase tracking-wider">Acc</div>
                                    <div className="font-mono text-emerald-400">{run.metrics.accuracy}%</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground text-xs uppercase tracking-wider">F1</div>
                                    <div className="font-mono text-primary/80">{run.metrics.f1Score}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
