import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import joblib
import os

def preprocess_data(df: pd.DataFrame, target_col: str = 'Risk', test_size: float = 0.2, random_state: int = 42):
    print("Début du pré-traitement des données...")
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    categorical_cols = X_train.select_dtypes(include=['object', 'category']).columns
    numeric_cols = X_train.select_dtypes(include=['int64', 'float64']).columns
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
        ])
    
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    feature_names = preprocessor.get_feature_names_out()
    
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(preprocessor, os.path.join(models_dir, 'preprocessor.pkl'))
    
    print(f"Pré-traitement terminé. Nouvelles dimensions : {X_train_processed.shape[1]} features.")
    return X_train_processed, X_test_processed, y_train, y_test, preprocessor

def apply_pca(X_train, X_test, n_components=0.95, random_state=42):
    print(f"Application de l'ACP (PCA) avec n_components={n_components}...")
    pca = PCA(n_components=n_components, random_state=random_state)
    
    X_train_pca = pca.fit_transform(X_train)
    X_test_pca = pca.transform(X_test)
    
    print(f"PCA : Dimensions réduites à {X_train_pca.shape[1]} composants")
    return X_train_pca, X_test_pca, pca

def apply_tsne(X_train, n_components=2, random_state=42):
    print(f"Application de t-SNE (composantes={n_components})...")
    tsne = TSNE(n_components=n_components, random_state=random_state)
    X_train_tsne = tsne.fit_transform(X_train)
    
    return X_train_tsne, tsne
