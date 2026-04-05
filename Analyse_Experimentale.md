# Analyse Expérimentale - Tâche 3

Ce rapport documente les expérimentations réalisées lors de la modélisation pour la prédiction du risque de crédit bancaire. Toutes les expériences ont été tracées en utilisant **MLflow**.

## Algorithmes Testés
Les modèles suivants ont été retenus pour notre problématique de classification :
1. **Régression Logistique** : Modèle linéaire simple, base de comparaison solide.
2. **Support Vector Machine (SVM)** : Excellent pour séparer des classes via une frontière de décision non-linéaire (Kernel RBF).
3. **Random Forest** : Modèle ensembliste, souvent robuste au sur-apprentissage.
4. **k-Nearest Neighbors (KNN)** : Apprentissage basé sur la proximité.

## Pré-traitement et Paramètres
Le dataset comporte des variables continues et catégorielles.
* **Encodage** : One-Hot Encoding via `ColumnTransformer`.
* **Standardisation** : StandardScaler (nécessaire pour KNN, SVM, et PCA).
* **Réduction de Dimensionnalité** : Application de l'ACP (PCA) avec 95% de variance expliquée sur certains runs. `t-SNE` a également été implémenté pour l'exploration de données.

**Hyperparamètres utilisés :**
* *Logistic Regression* : `C`: 1.0, `solver`: 'lbfgs'
* *SVM* : `C`: 1.0, `kernel`: 'rbf'
* *Random Forest* : `n_estimators`: 100, `max_depth`: None
* *KNN* : `n_neighbors`: 5, `weights`: 'uniform'

## Résultats Obtenus
Les résultats détaillés se trouvent dans `Tableau_Comparatif.md` généré automatiquement depuis les logs MLflow.
Globalement :
* Les performances gravitent entre 72.5% et 80% d'Accuracy globale.
* Les modèles linéaires ou basés sur SVM tirent le meilleur parti de ces variables.
* La réduction de dimension PCA a montré un impact empirique notable sur les performances (voir Analyse Critique).
