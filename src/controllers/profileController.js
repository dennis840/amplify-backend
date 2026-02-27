const cloudinary = require('../config/cloudinary');
const db = require('../config/database');

// PASO 1 - datos básicos + foto
exports.createProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { artisticName, country, province, city } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'amplify_profiles' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    // Crear o actualizar perfil
    await db.query(
      `INSERT INTO musician_profiles (user_id, artistic_name, country, province, city, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         artistic_name=$2, country=$3, province=$4, city=$5, profile_image=$6, updated_at=NOW()`,
      [userId, artisticName, country, province, city, imageUrl]
    );

    return res.status(200).json({ message: 'Paso 1 guardado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error guardando paso 1' });
  }
};

// PASO 2 - instrumentos, nivel, géneros, influencias
exports.updateProfileStep2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { instruments, musicalLevel, sings, genres, influences } = req.body;

    const instrumentsArray = typeof instruments === 'string' ? JSON.parse(instruments) : instruments;
    const genresArray = typeof genres === 'string' ? JSON.parse(genres) : genres;
    const influencesArray = typeof influences === 'string' ? JSON.parse(influences) : influences;
    const singsBoolean = sings === 'true' || sings === true;

    await db.query(
      `UPDATE musician_profiles SET
        instruments=$1, musical_level=$2, sings=$3, genres=$4, influences=$5, updated_at=NOW()
       WHERE user_id=$6`,
      [instrumentsArray, musicalLevel, singsBoolean, genresArray, influencesArray, userId]
    );

    return res.status(200).json({ message: 'Paso 2 guardado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error guardando paso 2' });
  }
};

// PASO 3 - bio, zona, demo
exports.updateProfileStep3 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { bio, zona, ubicacionManual, demoLink } = req.body;
    let demoUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'amplify_demos', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      demoUrl = result.secure_url;
    }

    await db.query(
      `UPDATE musician_profiles SET
        bio=$1, zone=$2, demo_url=$3, demo_link=$4, profile_complete=TRUE, updated_at=NOW()
       WHERE user_id=$5`,
      [bio, zona || ubicacionManual, demoUrl, demoLink, userId]
    );

    return res.status(200).json({ message: 'Perfil completado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error guardando paso 3' });
  }
};

// OBTENER perfil público
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    const result = await db.query(
      `SELECT mp.*, u.name, u.email
       FROM musician_profiles mp
       JOIN users u ON u.id = mp.user_id
       WHERE mp.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    return res.status(200).json({ profile: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo perfil' });
  }
};