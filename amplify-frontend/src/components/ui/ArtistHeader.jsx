function ArtistHeader() {
  return (
    <header
      style={{
        padding: "16px 32px",
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <strong>Amplify</strong>
      <nav>
        <span style={{ marginRight: "16px" }}>Discover</span>
        <span>Profile</span>
      </nav>
    </header>
  );
}

export default ArtistHeader;
