import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { analyzeDataset, trainModel, runAutoML } from './services/api';

import DataUploader from './components/features/DataUploader';
import DataPreview from './components/features/DataPreview';
import ClientForm from './components/features/ClientForm';
import ModelSelector from './components/features/ModelSelector';
import HyperparametersPanel from './components/features/HyperparametersPanel';
import TrainingProgress from './components/features/TrainingProgress';
import ResultsDashboard from './components/features/ResultsDashboard';
import HistoryList from './components/features/HistoryList';
import { Button } from './components/ui/Button';

import { Terminal, Database, Play, Wand2 } from 'lucide-react';

function App() {
  // --- States ---
  const [dataset, setDataset] = useState(null);

  const [clientData, setClientData] = useState({
    age: 35, amount: 5000, duration: 24, job: 'Salarié', savings: 'Moyen'
  });

  const [selectedModels, setSelectedModels] = useState(['rf']);
  const [params, setParams] = useState({});

  const [isTraining, setIsTraining] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  // --- Handlers ---
  const handleUpload = async (file) => {
    toast.promise(analyzeDataset(file), {
      loading: 'Analyse du CSV...',
      success: (data) => {
        setDataset(data);
        return `Dataset chargé : ${data.rows} lignes`;
      },
      error: 'Erreur lors du chargement',
    });
  };

  const handleTrain = async () => {
    if (selectedModels.length === 0) {
      toast.error('Veuillez sélectionner au moins un modèle.');
      return;
    }

    setIsTraining(true);
    try {
      // Simulate taking the first selected model (multi-select comparison handled in AutoML)
      const modelId = selectedModels[0];
      const result = await trainModel(modelId, params[modelId] || {}, clientData);

      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10
      toast.success('Simulation terminée avec succès !');
    } catch (err) {
      toast.error('Une erreur est survenue lors de l\'entraînement');
    } finally {
      setIsTraining(false);
    }
  };

  const handleAutoML = async () => {
    setIsTraining(true);
    toast('Lancement AutoML (Test de tous les modèles)...', { icon: '🤖' });
    try {
      const { bestModel, allResults } = await runAutoML(clientData);
      setSelectedModels([bestModel.modelId]);
      setCurrentResult(bestModel);
      setHistory(prev => [...allResults, ...prev].slice(0, 10));
      toast.success(`Le meilleur modèle trouvé est ${bestModel.modelId.toUpperCase()} avec ${bestModel.metrics.accuracy}% d'accuracy!`);
    } catch (err) {
      toast.error('Erreur AutoML');
    } finally {
      setIsTraining(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success('Historique effacé');
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative overflow-hidden font-sans">

      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
            <Terminal className="w-8 h-8 text-primary" />
            Bank Simulator
          </h1>
          <p className="text-muted-foreground mt-1 ml-11">Plateforme de classification du risque de crédit</p>
        </div>
        <div className="flex items-center gap-2">
          {dataset ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-sm font-medium">
              <Database className="w-4 h-4" />
              Données Actives
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 border border-destructive/20 text-destructive rounded-full text-sm font-medium">
              <Database className="w-4 h-4" />
              Aucune donnée
            </div>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">

        {/* Overlay progress bar on top of everything if training */}
        {isTraining && (
          <div className="absolute inset-0 z-40 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="w-full max-w-2xl">
              <TrainingProgress isTraining={isTraining} />
            </div>
          </div>
        )}

        {/* Left Column (Data & Client) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          {!dataset ? (
            <DataUploader onUpload={handleUpload} />
          ) : (
            <DataPreview dataset={dataset} />
          )}

          <div className="flex-1">
            <ClientForm clientData={clientData} setClientData={setClientData} />
          </div>
        </div>

        {/* Center Column (Models & Actions) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="shrink-0">
            <ModelSelector
              selectedModels={selectedModels}
              toggleModel={setSelectedModels}
              multiSelect={false} // Switch to true if we fully implement comparison checkbox
            />
          </div>

          <div className="flex-1">
            <HyperparametersPanel
              selectedModels={selectedModels}
              params={params}
              setParams={setParams}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 shrink-0 mt-auto">
            <Button
              size="lg"
              className="w-full font-bold shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all border border-primary/50 gap-2"
              onClick={handleTrain}
              disabled={isTraining || selectedModels.length === 0}
            >
              <Play className="w-5 h-5 fill-current" />
              Lancer le Training
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full font-bold border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 transition-all gap-2"
              onClick={handleAutoML}
              disabled={isTraining}
            >
              <Wand2 className="w-5 h-5" />
              AutoML (Magique)
            </Button>
          </div>
        </div>

        {/* Right Column (Results) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="flex-1">
            <ResultsDashboard result={currentResult} />
          </div>

          <div className="shrink-0 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <HistoryList history={history} clearHistory={clearHistory} />
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
