import pandas as pd
import os

def load_data(file_name: str = 'cleaned_data.csv') -> pd.DataFrame:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, '..', 'data')
    file_path = os.path.join(data_dir, file_name)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Le fichier {file_path} est introuvable.")
        
    print(f"Chargement des données depuis : {file_path}")
    df = pd.read_csv(file_path)
    
    return df

if __name__ == "__main__":
    df = load_data()
    print(f"Aperçu des données chargées : {df.shape[0]} lignes, {df.shape[1]} colonnes.")
    print(df.head())
