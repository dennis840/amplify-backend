const db = require('../config/database');

// ===============================
// GET /api/musicians
// ===============================
exports.getMusicians = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener ubicación del usuario autenticado
    const userProfile = await db.query(
      `SELECT city, province, country 
       FROM musician_profiles 
       WHERE user_id = $1 AND profile_complete = TRUE`,
      [userId]
    );

    if (userProfile.rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado o incompleto' });
    }

    const { city, province, country } = userProfile.rows[0];

    let musicians = [];
    let titulo = '';

    // 1️⃣ Misma ciudad
    const cityResult = await db.query(
      `SELECT user_id AS id, artistic_name, instruments, genres, city, province,
              profile_image, musical_level, zone
       FROM musician_profiles
       WHERE city = $1
         AND profile_complete = TRUE
         AND user_id != $2`,
      [city, userId]
    );

    musicians = cityResult.rows;

    if (musicians.length >= 5) {
      titulo = `Músicos en ${city}`;
    } else {
      // 2️⃣ Misma provincia
      const provinceResult = await db.query(
        `SELECT user_id AS id, artistic_name, instruments, genres, city, province,
                profile_image, musical_level, zone
         FROM musician_profiles
         WHERE province = $1
           AND profile_complete = TRUE
           AND user_id != $2`,
        [province, userId]
      );

      musicians = provinceResult.rows;

      if (musicians.length >= 5) {
        titulo = `Músicos en ${province}`;
      } else {
        // 3️⃣ Mismo país
        const countryResult = await db.query(
          `SELECT user_id AS id, artistic_name, instruments, genres, city, province,
                  profile_image, musical_level, zone
           FROM musician_profiles
           WHERE country = $1
             AND profile_complete = TRUE
             AND user_id != $2`,
          [country, userId]
        );

        musicians = countryResult.rows;

        if (musicians.length >= 5) {
          titulo = `Músicos en ${country}`;
        } else {
          // 4️⃣ Todos
          const allResult = await db.query(
            `SELECT user_id AS id, artistic_name, instruments, genres, city, province,
                    profile_image, musical_level, zone
             FROM musician_profiles
             WHERE profile_complete = TRUE
               AND user_id != $1`,
            [userId]
          );

          musicians = allResult.rows;
          titulo = 'Músicos registrados';
        }
      }
    }

    return res.status(200).json({ musicians, titulo });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo músicos' });
  }
};

// ===============================
// GET /api/musicians/search?q=
// ===============================
exports.searchMusicians = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: 'Debe proporcionar un término de búsqueda' });
    }

    const result = await db.query(
      `SELECT user_id AS id, artistic_name, instruments, genres, city, province,
              profile_image, musical_level, zone
       FROM musician_profiles
       WHERE profile_complete = TRUE
         AND (
           artistic_name ILIKE $1 OR
           city ILIKE $1 OR
           province ILIKE $1 OR
           EXISTS (
             SELECT 1 FROM unnest(instruments) AS instrument
             WHERE instrument ILIKE $1
           ) OR
           EXISTS (
             SELECT 1 FROM unnest(genres) AS genre
             WHERE genre ILIKE $1
           )
         )`,
      [`%${searchTerm}%`]
    );

    return res.status(200).json({ musicians: result.rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error buscando músicos' });
  }
};

// ===============================
// GET /api/musicians/:id
// ===============================
exports.getMusicianById = async (req, res) => {
  try {
    const musicianId = req.params.id;

    const result = await db.query(
      `SELECT mp.*, u.name, u.email
       FROM musician_profiles mp
       JOIN users u ON u.id = mp.user_id
       WHERE mp.user_id = $1`,
      [musicianId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Músico no encontrado' });
    }

    return res.status(200).json({ musician: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo músico' });
  }
};