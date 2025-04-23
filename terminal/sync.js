const { sequelize } = require('../models');

sequelize.drop()
  .then(() => sequelize.sync({ force: true }))
  .then(() => {
    console.log('✅ Base de données synchronisée avec succès.');
    process.exit();
  })
  .catch((err) => {
    console.log('❌ Erreur de synchronisation de la BDD :', err);
    process.exit(1);
  })