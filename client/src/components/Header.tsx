import Help from "./Help";

function Header() {
  return (
    <header
      style={{
        background: "#269bfb",
        color: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "1rem 0",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          QR Experience <span style={{ color: "#000000" }}>Designer</span>
        </div>
        <div>
          <Help />
        </div>
      </nav>
    </header>
  );
}

export default Header;
