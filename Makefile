.PHONY: setup train register serve test pipeline

setup:
	pip install -r backend/requirements.txt
	mlflow ui --host 0.0.0.0 --port 5000 &

train:
	python backend/train.py

register:
	python backend/get_best_run.py

serve:
	mlflow models serve -m "models:/mon_modele_production/Staging" --port 1234 --no-conda &

test:
	python backend/test_api.py

pipeline: train register serve test
	@echo "Pipeline complet execute avec succes"
