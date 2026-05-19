import os
import subprocess
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import mlflow
from scipy import stats

from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, DataQualityPreset
from evidently.metrics import DatasetDriftMetric

def main():
    print("=== 6.2 SIMULATION DU DRIFT ===")
    
    # Chemins adaptés
    data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'cleaned_data.csv')
    df = pd.read_csv(data_path)
    
    X = df.drop('target', axis=1)
    y = df['target']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Simulation du drift : décalage de moyenne + bruit
    X_prod = X_test.copy()
    num_cols = X_prod.select_dtypes(include=np.number).columns
    
    # On simule le drift sur 40% des variables pour dépasser le seuil de 30%
    n_drift = int(len(num_cols) * 0.4)
    for col in num_cols[:n_drift]:
        X_prod[col] = X_prod[col] * 1.6 + np.random.normal(0, 0.5, len(X_prod))
        
    print(f"Moyenne '{num_cols[0]}' - Ref: {X_train[num_cols[0]].mean():.3f} | Prod: {X_prod[num_cols[0]].mean():.3f}")
    
    # Configuration MLflow
    mlruns_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'mlruns')
    mlflow.set_tracking_uri(f"file:///{mlruns_dir.replace(chr(92), '/')}")
    mlflow.set_experiment('monitoring_drift')
    
    with mlflow.start_run(run_name='drift_check_v1'):
        print("\n=== 6.3 RAPPORT EVIDENTLY & MLFLOW ===")
        print("Génération du rapport HTML...")
        
        report = Report(metrics=[DataDriftPreset(), DataQualityPreset()])
        report.run(reference_data=X_train, current_data=X_prod)
        report_path = 'drift_report.html'
        report.save_html(report_path)
        mlflow.log_artifact(report_path)
        
        print("Calcul des scores numériques Evidently...")
        score_report = Report(metrics=[DatasetDriftMetric()])
        score_report.run(reference_data=X_train, current_data=X_prod)
        result = score_report.as_dict()
        
        drift_share = result['metrics'][0]['result']['drift_share']
        dataset_drift = result['metrics'][0]['result']['dataset_drift']
        n_drifted = result['metrics'][0]['result']['number_of_drifted_columns']
        n_total = result['metrics'][0]['result']['number_of_columns']
        
        mlflow.log_metric('drift_share', drift_share)
        mlflow.log_metric('drifted_columns', n_drifted)
        mlflow.log_metric('total_columns', n_total)
        mlflow.log_metric('dataset_drifted', int(dataset_drift))
        
        print(f"Drift share : {drift_share:.2%} | Colonnes driftées : {n_drifted}/{n_total}")
        
        print("\n=== 6.4 TEST STATISTIQUE KS (Par Feature) ===")
        results = []
        for col in X_train.select_dtypes(include='number').columns:
            stat, pvalue = stats.ks_2samp(X_train[col], X_prod[col])
            results.append({
                'feature': col,
                'ks_stat': round(stat, 4),
                'p_value': round(pvalue, 4),
                'drifted': pvalue < 0.05
            })
            mlflow.log_metric(f"ks_pvalue_{col}", pvalue)
            
        df_drift = pd.DataFrame(results)
        df_drift.to_csv('ks_drift_results.csv', index=False)
        mlflow.log_artifact('ks_drift_results.csv')
        
        # Nettoyage local
        if os.path.exists(report_path): os.remove(report_path)
        if os.path.exists('ks_drift_results.csv'): os.remove('ks_drift_results.csv')
        
        print("\n=== 6.5 DÉCLENCHEMENT AUTOMATIQUE ===")
        SEUIL_DRIFT = 0.30
        SEUIL_WARN = 0.15
        
        if drift_share > SEUIL_DRIFT:
            print(f"CRITIQUE : drift {drift_share:.2%} > seuil {SEUIL_DRIFT:.0%}")
            mlflow.log_metric('retrain_triggered', 1)
            print(">>> Lancement automatique du ré-entraînement (train.py) <<<")
            
            train_script = os.path.join(os.path.dirname(__file__), 'train.py')
            subprocess.run(['python', train_script, '--retrain'], check=True)
            print("\n>>> Ré-entraînement terminé avec succès ! Boucle MLOps fermée. <<<")
            
        elif drift_share > SEUIL_WARN:
            print(f"AVERTISSEMENT : drift {drift_share:.2%} — surveillance renforcée")
            mlflow.log_metric('retrain_triggered', 0)
        else:
            print(f"OK : drift {drift_share:.2%} — modèle stable")
            mlflow.log_metric('retrain_triggered', 0)

if __name__ == "__main__":
    main()
