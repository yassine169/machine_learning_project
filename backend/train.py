import os
import mlflow
import mlflow.sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

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
        print(f" >> Résultat {model_name} | Accuracy: {accuracy:.4f} | F1: {f1:.4f}")

def main():
    mlruns_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'mlruns')
    mlflow.set_tracking_uri(f"file:///{mlruns_dir.replace(chr(92), '/')}")
    mlflow.set_experiment("Credit_Risk_Classification")
    
    df = load_data('cleaned_data.csv')
    X_train, X_test, y_train, y_test, preprocessor = preprocess_data(df)
    
    X_train_pca, X_test_pca, pca_model = apply_pca(X_train, X_test, n_components=0.95)
    
    models_to_test = [
        {"name": "Logistic_Regression", "model": LogisticRegression(max_iter=2000, random_state=42), "params": {"C": 1.0, "solver": "lbfgs"}},
        {"name": "KNN", "model": KNeighborsClassifier(), "params": {"n_neighbors": 5, "weights": "uniform"}},
        {"name": "SVM", "model": SVC(random_state=42), "params": {"C": 1.0, "kernel": "rbf"}},
        {"name": "Random_Forest", "model": RandomForestClassifier(random_state=42), "params": {"n_estimators": 100, "max_depth": None}}
    ]
    
    print("\n--- DÉBUT DES EXPÉRIMENTATIONS MLFLOW ---")
    for m in models_to_test:
        train_and_log_model(m["name"], m["model"], X_train, y_train, X_test, y_test, m["params"], use_pca=False)
        
    print("\n--- TEST AVEC RÉDUCTION DE DIMENSION (PCA) ---")
    for m in models_to_test:
        if m["name"] in ["Random_Forest", "Logistic_Regression"]:
            train_and_log_model(m["name"], m["model"], X_train_pca, y_train, X_test_pca, y_test, m["params"], use_pca=True)
            
    print("\nFin des expérimentations.")

if __name__ == "__main__":
    main()
