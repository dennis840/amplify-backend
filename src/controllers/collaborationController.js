const db = require('../config/database');

const VALID_PROPOSITO = ["Proyecto personal", "Banda", "Estudio", "Tour"];
const VALID_MODALIDAD = ["Presencial", "Remoto", "Híbrido"];
const VALID_COMPENSACION = ["Voluntario", "Pagado", "A convenir"];
const VALID_DISPONIBILIDAD = ["Fines de semana", "Entre semana", "Flexible"];

exports.createCollaboration = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      title, description, role_needed, genre, city, musical_level,
      habilidades_requeridas, habilidades_deseadas,
      proposito, modalidad, compensacion, disponibilidad, demo_link,
    } = req.body;

    if (!title) return res.status(400).json({ message: "El título es requerido" });
    if (!role_needed) return res.status(400).json({ message: "El rol es requerido" });
    if (!genre) return res.status(400).json({ message: "El género es requerido" });
    if (!city) return res.status(400).json({ message: "La ciudad es requerida" });

    if (proposito && !VALID_PROPOSITO.includes(proposito))
      return res.status(400).json({ message: "Propósito inválido" });
    if (modalidad && !VALID_MODALIDAD.includes(modalidad))
      return res.status(400).json({ message: "Modalidad inválida" });
    if (compensacion && !VALID_COMPENSACION.includes(compensacion))
      return res.status(400).json({ message: "Compensación inválida" });
    if (disponibilidad && !VALID_DISPONIBILIDAD.includes(disponibilidad))
      return res.status(400).json({ message: "Disponibilidad inválida" });

    const cover_image = req.files?.cover_image?.[0]?.path || null;
    const demo_file_url = req.files?.demo_file?.[0]?.path || null;

    const result = await db.query(
      `INSERT INTO collaborations 
      (user_id, title, description, role_needed, genre, city, musical_level,
       habilidades_requeridas, habilidades_deseadas,
       proposito, modalidad, compensacion, disponibilidad,
       cover_image, demo_file_url, demo_link, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'active')
      RETURNING *`,
      [
        user_id, title, description, role_needed, genre, city, musical_level || null,
        habilidades_requeridas || null, habilidades_deseadas || null,
        proposito || null, modalidad || null, compensacion || null, disponibilidad || null,
        cover_image, demo_file_url, demo_link || null,
      ]
    );

    const colab = result.rows[0];
    const profile = await db.query(
      `SELECT artistic_name, profile_image FROM musician_profiles WHERE user_id = $1`,
      [user_id]
    );

    res.status(201).json({
      collaboration: {
        ...colab,
        artistic_name: profile.rows[0]?.artistic_name || null,
        profile_image: profile.rows[0]?.profile_image || null,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando colaboración" });
  }
};

exports.getCollaborations = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, 
              mp.artistic_name,
              mp.profile_image
       FROM collaborations c
       JOIN musician_profiles mp ON c.user_id = mp.user_id
       WHERE c.status = 'active'
       ORDER BY c.created_at DESC`
    );
    res.json({ collaborations: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo colaboraciones" });
  }
};

exports.getCollaborationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT c.*, 
              mp.artistic_name,
              mp.profile_image
       FROM collaborations c
       JOIN musician_profiles mp ON c.user_id = mp.user_id
       WHERE c.id = $1`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });
    res.json({ collaboration: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo colaboración" });
  }
};

exports.updateCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const owner = await db.query("SELECT * FROM collaborations WHERE id = $1", [id]);
    if (owner.rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });
    if (owner.rows[0].user_id !== user_id)
      return res.status(403).json({ message: "No autorizado" });

    const {
      title, description, role_needed, genre, city, musical_level,
      habilidades_requeridas, habilidades_deseadas,
      proposito, modalidad, compensacion, disponibilidad, demo_link, status,
    } = req.body;

    const cover_image = req.files?.cover_image?.[0]?.path || owner.rows[0].cover_image;
    const demo_file_url = req.files?.demo_file?.[0]?.path || owner.rows[0].demo_file_url;

    const result = await db.query(
      `UPDATE collaborations SET
        title=$1, description=$2, role_needed=$3, genre=$4, city=$5, musical_level=$6,
        habilidades_requeridas=$7, habilidades_deseadas=$8,
        proposito=$9, modalidad=$10, compensacion=$11, disponibilidad=$12,
        demo_link=$13, cover_image=$14, demo_file_url=$15, status=$16,
        updated_at=NOW()
      WHERE id=$17 RETURNING *`,
      [
        title, description, role_needed, genre, city, musical_level || null,
        habilidades_requeridas || null, habilidades_deseadas || null,
        proposito || null, modalidad || null, compensacion || null, disponibilidad || null,
        demo_link || null, cover_image, demo_file_url,
        status || owner.rows[0].status, id,
      ]
    );
    res.json({ collaboration: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando colaboración" });
  }
};

exports.deleteCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const owner = await db.query("SELECT * FROM collaborations WHERE id = $1", [id]);
    if (owner.rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });
    if (owner.rows[0].user_id !== user_id)
      return res.status(403).json({ message: "No autorizado" });

    await db.query("DELETE FROM collaborations WHERE id = $1", [id]);
    res.json({ success: true, message: "Colaboración eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando colaboración" });
  }
};

exports.getMyCollaborations = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await db.query(
      `SELECT c.*, mp.artistic_name, mp.profile_image
       FROM collaborations c
       JOIN musician_profiles mp ON c.user_id = mp.user_id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [user_id]
    );
    res.json({ collaborations: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo mis colaboraciones" });
  }
};