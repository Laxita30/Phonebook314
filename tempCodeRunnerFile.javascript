const path = require('path');

try {
  const expressPath = require.resolve('express');
  console.log('Express module path:', expressPath);
} catch (err) {
  console.error('Error resolving express module:', err);
}