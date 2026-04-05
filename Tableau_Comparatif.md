# Comparaison des Modèles de Classification (Tâche 3)

Ce tableau récapitale les performances des divers algorithmes essayés, classés par le meilleur Accuracy.

| Modèle              | PCA Utilisé   | Paramètres                       |   Accuracy |   Precision |   Recall |   F1-Score |
|:--------------------|:--------------|:---------------------------------|-----------:|------------:|---------:|-----------:|
| Logistic_Regression | True          | C=1.0, solver=lbfgs              |      0.8   |      0.7928 |    0.8   |     0.793  |
| SVM                 | False         | C=1.0, kernel=rbf                |      0.79  |      0.7819 |    0.79  |     0.776  |
| Logistic_Regression | False         | C=1.0, solver=lbfgs              |      0.78  |      0.7711 |    0.78  |     0.7723 |
| Logistic_Regression | False         | C=1.0, solver=lbfgs              |      0.78  |      0.7711 |    0.78  |     0.7723 |
| Random_Forest       | True          | max_depth=None, n_estimators=100 |      0.77  |      0.7744 |    0.77  |     0.7338 |
| Random_Forest       | False         | max_depth=None, n_estimators=100 |      0.74  |      0.7217 |    0.74  |     0.7203 |
| KNN                 | False         | n_neighbors=5, weights=uniform   |      0.725 |      0.7028 |    0.725 |     0.7028 |
| KNN                 | False         | n_neighbors=5, weights=uniform   |      0     |      0      |    0     |     0      |