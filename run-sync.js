const { syncInstagramData } = require('./src/features/instagram/services/processor');
syncInstagramData().then(() => console.log('Sync Done')).catch(console.error);
