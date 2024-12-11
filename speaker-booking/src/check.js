const fs = require('fs');
const path = require('path');

const modelsPath = path.join(__dirname, '../models');
console.log('Models directory path:', modelsPath);

if (fs.existsSync(modelsPath)) {
  console.log('Models directory exists');
} else {
  console.error('Models directory NOT found at:', modelsPath);
}
