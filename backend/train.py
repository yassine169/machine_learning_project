import os
import mlflow
import mlflow.sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, ConfusionMatrixDisplay, classification_report
import matplotlib.pyplot as plt
import xgboost as xgb

from data_loader import load_data
from preprocessing import preprocess_data, apply_pca

def train_and_log_model(model_name, model, X_train, y_train, X_test, y_test, params, use_pca=False):
    run_name = f"{model_name}{'_PCA' if use_pca else ''}"
    
    with mlflow.start_run(run_name=run_name):
        model.set_params(**params)
        
        mlflow.log_params(params)
        mlflow.log_param("use_pca", use_pca)
        
        print(f"Entraînement de {model_name} (PCA={use_pca})...")
        
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("precision", precision)
        mlflow.log_metric("recall", recall)
        mlflow.log_metric("f1_score", f1)
        
        mlflow.sklearn.log_model(model, "model")
        
        # --- LOGGING DES ARTEFACTS ---
        # 1. Matrice de confusion
        fig, ax = plt.subplots(figsize=(8, 6))
        ConfusionMatrixDisplay.from_predictions(y_test, y_pred, ax=ax)
        cm_filename = f"confusion_matrix_{run_name}.png"
        plt.savefig(cm_filename)
        mlflow.log_artifact(cm_filename)
        plt.close(fig) # Libérer la mémoire
        
        # 2. Rapport de classification
        report = classification_report(y_test, y_pred)
        report_filename = f"classification_report_{run_name}.txt"
        with open(report_filename, 'w', encoding='utf-8') as f:
            f.write(report)
        mlflow.log_artifact(report_filename)
        
        # Nettoyage des fichiers locaux
        if os.path.exists(cm_filename):
            os.remove(cm_filename)
        if os.path.exists(report_filename):
            os.remove(report_filename)
            
        print(f" >> Résultat {model_name} | Accuracy: {accuracy:.4f} | F1: {f1:.4f}")

def main():
    mlruns_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'mlruns')
    mlflow.set_tracking_uri(f"file:///{mlruns_dir.replace(chr(92), '/')}")
    mlflow.set_experiment("Credit_Risk_Classification")
    
    df = load_data('cleaned_data.csv')
    X_train, X_test, y_train, y_test, preprocessor = preprocess_data(df)
    
    X_train_pca, X_test_pca, pca_model = apply_pca(X_train, X_test, n_components=0.95)
    
    models_to_test = [
        {"name": "RF_Baseline", "model": RandomForestClassifier(random_state=42), "params": {"n_estimators": 50, "max_depth": 3}},
        {"name": "RF_Deep", "model": RandomForestClassifier(random_state=42), "params": {"n_estimators": 200, "max_depth": 10}},
        {"name": "GradientBoosting", "model": GradientBoostingClassifier(random_state=42), "params": {"n_estimators": 100, "learning_rate": 0.1}},
        {"name": "Logistic_Regression", "model": LogisticRegression(max_iter=2000, random_state=42), "params": {"C": 1.0, "solver": "lbfgs"}},
        {"name": "SVM", "model": SVC(random_state=42), "params": {"C": 1.0, "kernel": "rbf"}},
        {"name": "XGBoost", "model": xgb.XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss'), "params": {"n_estimators": 100, "learning_rate": 0.1, "max_depth": 5}},
        {"name": "AdaBoost", "model": AdaBoostClassifier(random_state=42), "params": {"n_estimators": 100, "learning_rate": 0.1}},
    ]
    
    print("\n--- DÉBUT DES EXPÉRIMENTATIONS MLFLOW ---")
    for m in models_to_test:
        train_and_log_model(m["name"], m["model"], X_train, y_train, X_test, y_test, m["params"], use_pca=False)
        
    print("\n--- TEST AVEC RÉDUCTION DE DIMENSION (PCA) ---")
    for m in models_to_test:
        if m["name"] in ["RF_Baseline", "RF_Deep", "GradientBoosting", "Logistic_Regression", "XGBoost", "AdaBoost"]:
            train_and_log_model(m["name"], m["model"], X_train_pca, y_train, X_test_pca, y_test, m["params"], use_pca=True)
            
    print("\nFin des expérimentations.")

if __name__ == "__main__":
    main()
