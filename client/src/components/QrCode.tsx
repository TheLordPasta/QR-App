import QRCode from "react-qr-code";

function QRCodeWall() {
  return (
    <div id="wallQR">
      <QRCode
        value="<https://www.google.com>"
        style={{
          width: "240px",
          height: "240px",
          marginTop: "80px",
          marginLeft: "80px",
        }}
      />
    </div>
  );
}

function QRCodeDesk() {
  return (
    <div id="deskQR">
      <QRCode
        value="<https://www.google.com>"
        style={{
          width: "240px",
          height: "240px",
          marginTop: "80px",
          marginLeft: "80px",
        }}
      />
    </div>
  );
}

export { QRCodeWall, QRCodeDesk };
