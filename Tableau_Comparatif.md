# Comparaison des Modèles de Classification (Tâche 3)

## Contexte des données

- Jeu de données réel utilisé : `cleaned_data.csv`
- Domaine : crédit bancaire / risque de crédit
- Prétraitement : encodage des variables catégorielles, standardisation des variables numériques
- Séparation train/test : 80% entraînement, 20% test
- Évaluation réalisée sur le jeu de test issu de `cleaned_data.csv`

## Tableau comparatif des résultats par modèle

| Modèle | PCA | Hyperparamètres | Accuracy (test) | F1-score (test) | Observations |
|:---|:---:|:---|:---:|:---:|:---|
| Régression Logistique | Oui | C=1.0, solver=lbfgs | 0.80 | 0.7930 | Meilleure performance globale grâce à PCA |
| Régression Logistique | Non | C=1.0, solver=lbfgs | 0.78 | 0.7723 | Modèle linéaire stable et interprétable |
| SVM | Non | C=1.0, kernel=rbf | 0.79 | 0.7760 | Bon résultat sans PCA, sensible à la normalisation |
| KNN | Non | n_neighbors=5, weights=uniform | 0.725 | 0.7028 | Performance la plus faible, dépend fortement des distances |
| Random Forest | Oui | n_estimators=100, max_depth=None | 0.77 | 0.7338 | PCA améliore la robustesse et réduit le bruit |
| Random Forest | Non | n_estimators=100, max_depth=None | 0.74 | 0.7203 | Bon modèle d'ensemble mais moins performant sans PCA |
| AdaBoost | Oui | n_estimators=100, learning_rate=1.0 | 0.755 | 0.7397 | Léger gain de robustesse, mais PCA diminue un peu le score |
| AdaBoost | Non | n_estimators=100, learning_rate=1.0 | 0.77 | 0.7603 | Bon compromis, stable sur ce dataset |
| XGBoost | Oui | n_estimators=100, learning_rate=0.1, max_depth=5 | 0.74 | 0.7270 | Stable mais sensible à la réduction de dimension |
| XGBoost | Non | n_estimators=100, learning_rate=0.1, max_depth=5 | 0.745 | 0.7333 | Performant sur données brutes, bon pour ce dataset |

## Conclusion

- Le meilleur modèle observé est la **Régression Logistique avec PCA**.
- La **PCA** aide surtout la Régression Logistique et le Random Forest.
- **AdaBoost** et **XGBoost** sont bien intégrés et montrent des résultats cohérents, même si sur ce dataset le gain par rapport à la régression logistique est moindre.
- Le jeu de données réel et la séparation test/entraînement permettent de comparer les modèles de manière objective.
