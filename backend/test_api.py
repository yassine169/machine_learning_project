import requests
import json
import random

def main():
    # Notre modèle (Logistic_Regression_PCA) s'attend à 32 features à cause du PCA.
    # Si on envoie moins, Pandas crachera une erreur de dimension lors de l'inférence.
    columns = [f"feature_{i}" for i in range(1, 33)]
    
    # Génération de 2 lignes de test avec des données aléatoires
    data = [
        [random.random() for _ in range(32)],
        [random.random() for _ in range(32)]
    ]

    payload = {
        'dataframe_split': {
            'columns': columns,
            'data': data
        }
    }

    try:
        print("Envoi de la requête à l'API MLflow (http://localhost:1234/invocations)...")
        resp = requests.post('http://localhost:1234/invocations', json=payload)
        
        if resp.status_code == 200:
            print("\n[OK] SUCCES : L'API a repondu correctement !")
            print('Predictions retournees :', resp.json())
        else:
            print(f"\n[ERREUR] API (Code {resp.status_code}):")
            print(resp.text)
    except requests.exceptions.ConnectionError:
        print("\n[ERREUR] DE CONNEXION : Impossible de joindre localhost:1234.")
        print("Avez-vous bien lance la commande 'mlflow models serve ...' dans un autre terminal ?")

if __name__ == "__main__":
    main()
