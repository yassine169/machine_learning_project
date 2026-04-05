# Analyse Critique - Tâche 3

Suite aux évaluations MLflow sur divers modèles de machine learning pour notre système bancaire, voici nos conclusions critiques :

### Quel algorithme donne les meilleurs résultats ?
L'algorithme ayant obtenu les meilleurs résultats est la **Régression Logistique** (avec réduction de dimension), avec une **Accuracy de 80%** et un **F1-score d'environ 79%**. 
Le modèle **SVM (79% d'accuracy)** offre également d'excellentes performances. 
L'avantage de la Régression Logistique est sa grande rapidité et sa forte explicabilité (très important en contexte bancaire pour justifier un refus de crédit), face à SVM ou Random Forest.

### Quels paramètres influencent le plus les performances ?
Bien que nos paramètres (ex: `C=1.0`, `n_estimators=100`) aient été les références par défaut de bon sens, le plus puissant levier s'est avéré être **la configuration des features en amont** (le Pipeline). 
Dans le contexte présent, l'application du StandardScaler a été absolument vitale pour atteindre de bonnes performances sur le SVM et le KNN (les variables comme le 'Credit_amount' l'auraient sinon totalement déséquilibré).

### La réduction de dimension améliore-t-elle les résultats ?
**Oui, de manière forte et confirmée !** 
Si l'on compare les runs MLflow, on s'aperçoit que :
* L'Accuracy de la **Régression Logistique** passe de **78% à 80%** lorsque les données utilisées proviennent de la décomposition PCA.
* L'Accuracy du **Random Forest** passe de **74% à 77%**.

**Explication :**
Le dataset bancaire initial comporte un grand nombre de variables binaires générées suite au One-Hot Encoding des variables catégorielles. L'ACP (PCA) élimine le bruit statistique, la forte multicolinéarité induite, et synthétise le signal principal (95% de la variance expliquée). Le modèle apprend alors sur une base plus propre et est moins sujet à l'overfitting.
