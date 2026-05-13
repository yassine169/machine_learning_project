const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/App.jsx',
  'src/services/fakeApi.js',
  'src/components/features/TrainingProgress.jsx',
  'src/components/features/ResultsDashboard.jsx',
  'src/components/features/HistoryList.jsx',
  'src/components/features/DataUploader.jsx',
  'src/components/features/DataPreview.jsx',
  'src/components/features/ClientForm.jsx',
  'src/components/features/ModelSelector.jsx',
  'src/components/features/HyperparametersPanel.jsx',
  'tailwind.config.js',
  'index.html',
  'package.json'
];

filesToClean.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Remove NexusML text from App.jsx and HTML
  content = content.replace(/Nexus<span className="text-primary">ML<\/span> Bank Simulator/g, "Évaluation Risque Crédit");
  content = content.replace(/<title>Vite \+ React<\/title>/g, "<title>Risque Crédit</title>");
  content = content.replace(/"name":\s*"frontend"/g, '"name": "evaluation-risque-credit"');
  
  // Remove JSX block comments
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "");
  
  // Remove standard block comments
  content = content.replace(/\/\*\*?[\s\S]*?\*\/\n?/g, "");
  
  // Process inline line comments
  if (!file.endsWith('.html') && !file.endsWith('.json')) {
    content = content.split('\n').map(line => {
      // Avoid destroying HTTP URLs, careful logic:
      const commentIndex = line.indexOf('//');
      if (commentIndex !== -1) {
        // Only strip if the preceding character isn't a colon (like http://)
        if (commentIndex === 0 || line[commentIndex - 1] !== ':') {
          return line.substring(0, commentIndex).trimEnd();
        }
      }
      return line.trimEnd();
    }).join('\n');
  }
  
  // Clean up excessive blank lines created by removing comments
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(fullPath, content);
});

console.log('Cleanup completed successfully!');
