import mongoose from 'mongoose';
import User from '..models/User.js'; // ruta correcta según tu estructura

mongoose.connect('mongodb://localhost:27017/plantilla-ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const migrateSurname = async () => {
  try {
    const usersWithSurname = await User.find({
      surname: { $exists: true }
    });

    for (const user of usersWithSuretName) {
      user.lastname = user.suretName;
      user.suretName = undefined;
      await user.save();
      console.log(`✅ Usuario migrado: ${user.name} ${user.lastname}`);
    }

    console.log('\n🎉 Migración completada con éxito');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    mongoose.disconnect();
  }
};

migrateSuretName();
