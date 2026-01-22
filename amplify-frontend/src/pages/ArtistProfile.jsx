import ArtistLayout from "../layouts/ArtistLayout"

function ArtistProfile() {
  return (
    <ArtistLayout>
      <section>
        <h1>Perfil del Artista</h1>

        <div className="profile-block">
          <strong>Nombre artístico</strong>
          <p>—</p>
        </div>

        <div className="profile-block">
          <strong>Género</strong>
          <p>—</p>
        </div>

        <div className="profile-block">
          <strong>Ubicación</strong>
          <p>—</p>
        </div>
      </section>
    </ArtistLayout>
  )
}

export default ArtistProfile
