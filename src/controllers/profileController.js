const db = require("../config/database");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// GET /api/profile/me
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const result = await db.query(
      `SELECT mp.*, u.name 
       FROM musician_profiles mp
       JOIN users u ON mp.user_id = u.id
       WHERE mp.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.json({ profile: result.rows[0] });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// PUT /api/profile - Step 1
exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { artisticName, country, province, city } = req.body;

    let profileImageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "amplify_profiles"
      );
      profileImageUrl = result.secure_url;
    }

    await db.query(
      `INSERT INTO musician_profiles 
       (user_id, artistic_name, country, province, city, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
         artistic_name = EXCLUDED.artistic_name,
         country = EXCLUDED.country,
         province = EXCLUDED.province,
         city = EXCLUDED.city,
         profile_image = COALESCE(EXCLUDED.profile_image, musician_profiles.profile_image),
         updated_at = NOW()`,
      [userId, artisticName, country, province, city, profileImageUrl]
    );

    res.json({ message: "Paso 1 guardado correctamente" });
  } catch (error) {
    console.error("Error en createProfile:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// PUT /api/profile/step2
exports.updateProfileStep2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { instruments, musicalLevel, sings, genres, influences } = req.body;

    await db.query(
      `UPDATE musician_profiles SET
         instruments = $1,
         musical_level = $2,
         sings = $3,
         genres = $4,
         influences = $5,
         updated_at = NOW()
       WHERE user_id = $6`,
      [instruments, musicalLevel, sings, genres, influences, userId]
    );

    res.json({ message: "Paso 2 guardado correctamente" });
  } catch (error) {
    console.error("Error en updateProfileStep2:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// PUT /api/profile/step3
exports.updateProfileStep3 = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, zona, demoLink } = req.body;

    let demoUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "amplify_demos",
        "auto"
      );
      demoUrl = result.secure_url;
    }

    await db.query(
      `UPDATE musician_profiles SET
         bio = $1,
         zone = $2,
         demo_url = COALESCE($3, demo_url),
         demo_link = COALESCE($4, demo_link),
         profile_complete = TRUE,
         updated_at = NOW()
       WHERE user_id = $5`,
      [bio || null, zona || null, demoUrl, demoLink || null, userId]
    );

    res.json({ message: "Perfil completado correctamente" });
  } catch (error) {
    console.error("Error en updateProfileStep3:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// PUT /api/profile/update
exports.updateFullProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      artisticName,
      country,
      province,
      city,
      zona,
      musicalLevel,
      sings,
      instruments,
      genres,
      influences,
      bio,
      demoLink
    } = req.body;

    let profileImageUrl = null;
    let demoUrl = null;

    if (req.files?.image?.[0]) {
      const result = await uploadToCloudinary(
        req.files.image[0].buffer,
        "amplify_profiles"
      );
      profileImageUrl = result.secure_url;
    }

    if (req.files?.demo?.[0]) {
      const result = await uploadToCloudinary(
        req.files.demo[0].buffer,
        "amplify_demos",
        "auto"
      );
      demoUrl = result.secure_url;
    }

    const parseJSON = (value) => {
  if (!value) return null;
  
  // Si ya es un objeto o array, convertirlo directamente a string JSON para la DB
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  
  try {
    // Si es un JSON string válido (ej: '["guitarra"]'), lo parsea y re-formatea
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed);
  } catch {
    // Si es texto plano (ej: "guitarra, voz" o texto libre), lo envuelve en un array
    const arrayFromText = value.split(",").map(item => item.trim()).filter(Boolean);
    return JSON.stringify(arrayFromText);
  }
};

    const result = await db.query(
      `UPDATE musician_profiles SET
         artistic_name = COALESCE($1, artistic_name),
         country = COALESCE($2, country),
         province = COALESCE($3, province),
         city = COALESCE($4, city),
         zone = COALESCE($5, zone),
         musical_level = COALESCE($6, musical_level),
         sings = COALESCE($7, sings),
         instruments = COALESCE($8, instruments),
         genres = COALESCE($9, genres),
         influences = COALESCE($10, influences),
         bio = COALESCE($11, bio),
         profile_image = COALESCE($12, profile_image),
         demo_url = COALESCE($13, demo_url),
         demo_link = COALESCE($14, demo_link),
         updated_at = NOW()
       WHERE user_id = $15
       RETURNING *`,
      [
        artisticName || null,
        country || null,
        province || null,
        city || null,
        zona || null,
        musicalLevel || null,
        sings !== undefined ? (sings === "true" || sings === true) : null,
        parseJSON(instruments),
        parseJSON(genres),
        parseJSON(influences),
        bio || null,
        profileImageUrl,
        demoUrl,
        demoLink || null,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    res.json({
      success: true,
      message: "Perfil actualizado",
      profile: result.rows[0]
    });

  } catch (error) {
    console.error("Error en updateFullProfile:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};