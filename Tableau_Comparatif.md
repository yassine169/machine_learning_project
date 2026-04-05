# Comparaison des Modèles de Classification (Tâche 3)

Un tableau comparatif des performances :

| Modèle | Paramètres | Métrique principale (Accuracy) |
|:---|:---|:---|
| Régression Logistique (PCA = True) | C=1.0, solver=lbfgs | 0.80 |
| SVM | C=1.0, kernel=rbf | 0.79 |
| Random Forest (PCA = True) | max_depth=None, n_estimators=100 | 0.77 |
| KNN | n_neighbors=5, weights=uniform | 0.725 |