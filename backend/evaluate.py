import os
import pandas as pd
import mlflow
from mlflow.tracking import MlflowClient

def evaluate_models():
    mlruns_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'mlruns')
    mlflow.set_tracking_uri(f"file:///{mlruns_dir.replace(chr(92), '/')}")
    
    experiment_name = "Credit_Risk_Classification"
    experiment = mlflow.get_experiment_by_name(experiment_name)
    
    if experiment is None:
        return
    
    client = MlflowClient()
    runs = client.search_runs(
        experiment_ids=[experiment.experiment_id],
        order_by=["metrics.accuracy DESC"]
    )
    
    results = []
    
    for run in runs:
        run_name = run.data.tags.get('mlflow.runName', 'Unknown')
        
        accuracy = run.data.metrics.get('accuracy', 0.0)
        f1_score = run.data.metrics.get('f1_score', 0.0)
        precision = run.data.metrics.get('precision', 0.0)
        recall = run.data.metrics.get('recall', 0.0)
        
        use_pca = run.data.params.get('use_pca', 'False')
        relevant_params = {k: v for k, v in run.data.params.items() if k != 'use_pca'}
        param_str = ", ".join([f"{k}={v}" for k, v in relevant_params.items()])
        
        results.append({
            "Modèle": run_name.replace("_PCA", ""),
            "PCA Utilisé": use_pca,
            "Paramètres": param_str if param_str else "Par défaut",
            "Accuracy": round(accuracy, 4),
            "Precision": round(precision, 4),
            "Recall": round(recall, 4),
            "F1-Score": round(f1_score, 4)
        })
        
    df_results = pd.DataFrame(results)
    
    md_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Tableau_Comparatif.md')
    try:
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write("# Comparaison des Modèles de Classification (Tâche 3)\n\n")
            f.write(df_results.to_markdown(index=False))
    except Exception as e:
        pass

if __name__ == "__main__":
    evaluate_models()
