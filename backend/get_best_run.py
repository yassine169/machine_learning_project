import mlflow
import os
from mlflow.tracking import MlflowClient

def main():
    mlruns_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'mlruns')
    mlflow.set_tracking_uri(f"file:///{mlruns_dir.replace(chr(92), '/')}")

    client = MlflowClient()
    experiment = client.get_experiment_by_name('Credit_Risk_Classification')

    if experiment:
        runs = client.search_runs(
            experiment_ids=[experiment.experiment_id],
            order_by=['metrics.accuracy DESC'],
            max_results=5
        )
        if runs:
            best_run = runs[0]
            print("\n" + "="*40)
            print("--- MEILLEUR RUN SELECTIONNE ---")
            print("="*40)
            print(f"ID du Run : {best_run.info.run_id}")
            print(f"Nom du Run : {best_run.data.tags.get('mlflow.runName', 'Inconnu')}")
            print(f"Accuracy : {best_run.data.metrics.get('accuracy', 0):.4f}")
            print(f"F1-Score : {best_run.data.metrics.get('f1_score', 0):.4f}")
            print(f"Paramètres : {best_run.data.params}")
            print("="*40 + "\n")
            
            # --- PARTIE 3 : MODEL REGISTRY ---
            print("="*40)
            print("--- ENREGISTREMENT DANS LE REGISTRY ---")
            print("="*40)
            best_run_id = best_run.info.run_id
            model_uri = f'runs:/{best_run_id}/model'
            
            # 10. Enregistrer le modèle
            registered = mlflow.register_model(
                model_uri=model_uri,
                name='mon_modele_production'
            )
            print(f"Version enregistrée : {registered.version}")
            
            # 11. Ajouter description et tags
            client.update_registered_model(
                name='mon_modele_production',
                description='Modèle de classification — version optimisée'
            )
            client.set_model_version_tag(
                name='mon_modele_production',
                version=registered.version,
                key='validated_by',
                value='equipe_data'
            )
            print("Description et tags mis à jour.")
            
            # --- PARTIE 3.2 : CYCLE DE VIE ---
            print("\n--- GESTION DU CYCLE DE VIE ---")
            # 12. Promouvoir en Staging
            client.transition_model_version_stage(
                name='mon_modele_production',
                version=registered.version,
                stage='Staging',
                archive_existing_versions=False
            )
            print(f"Modèle v{registered.version} promu en Staging.")
            
            # 13. Validation avant Production
            SEUIL_PRODUCTION = 0.85
            acc = best_run.data.metrics.get('accuracy', 0)
            if acc >= SEUIL_PRODUCTION:
                client.transition_model_version_stage(
                    name='mon_modele_production',
                    version=registered.version,
                    stage='Production'
                )
                print(f"Modèle v{registered.version} promu en Production (Accuracy {acc:.4f} >= {SEUIL_PRODUCTION}).")
            else:
                print(f"Modèle non promu en Production : accuracy {acc:.4f} < seuil {SEUIL_PRODUCTION}")

        else:
            print("Aucun run trouvé pour cette expérience.")
    else:
        print("Expérience 'Credit_Risk_Classification' non trouvée.")

if __name__ == "__main__":
    main()
