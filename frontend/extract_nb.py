import json

try:
    with open(r'c:\Users\yassine\Desktop\projet_ML\backend\data\étape 1.ipynb', 'r', encoding='utf-8') as f:
        nb = json.load(f)

    with open(r'c:\Users\yassine\Desktop\projet_ML\backend\etape_1.py', 'w', encoding='utf-8') as out:
        for cell in nb.get('cells', []):
            if cell.get('cell_type') == 'code':
                out.write(''.join(cell.get('source', [])))
                out.write('\n\n')
    print("Extraction réussie !")
except Exception as e:
    print(f"Erreur : {e}")
