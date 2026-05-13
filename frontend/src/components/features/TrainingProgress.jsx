import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Database, Brain, ActivitySquare } from 'lucide-react';

export default function TrainingProgress({ isTraining }) {
    const [step, setStep] = useState(0);
    // 0: Initial, 1: Loading Data, 2: Training, 3: Evaluating

    useEffect(() => {
        let timers = [];
        if (isTraining) {
            setStep(1);
            timers.push(setTimeout(() => setStep(2), 800)); // Loading Data 0.8s
            timers.push(setTimeout(() => setStep(3), 2200)); // Training 1.4s more
            timers.push(setTimeout(() => setStep(0), 3000)); // Done at 3.0s
        } else {
            setStep(0);
        }
        return () => timers.forEach(t => clearTimeout(t));
    }, [isTraining]);

    if (!isTraining && step === 0) return null;

    return (
        <Card className="mb-6 overflow-hidden relative border-primary shadow-lg shadow-primary/20 bg-background/90 backdrop-blur-md z-50">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary">
                <div
                    className="h-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>
            <CardContent className="pt-8 pb-6 px-10">
                <h3 className="text-center font-semibold text-lg mb-6">Simulation en cours...</h3>
                <div className="flex justify-between relative">

                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -z-10 -translate-y-1/2" />
                    <div
                        className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-700"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />

                    <StepIcon icon={Database} label="Préparation Data" active={step >= 1} current={step === 1} />
                    <StepIcon icon={Brain} label="Entraînement Modèle" active={step >= 2} current={step === 2} />
                    <StepIcon icon={ActivitySquare} label="Évaluation & Score" active={step >= 3} current={step === 3} />

                </div>
            </CardContent>
        </Card>
    );
}

function StepIcon({ icon: Icon, label, active, current }) {
    return (
        <div className={`flex flex-col items-center gap-2 transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-background transition-colors
        ${active ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}
        ${current ? 'shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse' : ''}
      `}>
                <Icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
        </div>
    );
}
