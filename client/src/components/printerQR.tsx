// Assuming you are still using TypeScript, you can define your props interface as needed.

const printElement = (elementId: string) => {
  const qr = document.getElementById(elementId);
  if (!qr) {
    console.error(`Element with id '${elementId}' not found.`);
    return;
  }
  console.log(`Element with id '${elementId}' found.`);

  // Open a new popup window
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Failed to open popup window.");
    return;
  }

  // Construct the HTML content with styles
  qr.style.visibility = "visible";
  const printContent = `
    <html>
      <head>
        <style>
          ${document.head.innerHTML}
        </style>
      </head>
      <body>
        ${qr.outerHTML}
      </body>
    </html>
  `;

  // Write the HTML content to the popup window
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Trigger the print dialog in the popup window
  printWindow.print();
  qr.style.visibility = "hidden";
  // Close the popup window after printing
  const checkPrintDialogClosed = () => {
    if (printWindow.closed) {
      clearTimeout(timeout);
      return;
    }
    timeout = setTimeout(checkPrintDialogClosed, 500);
  };

  let timeout = setTimeout(checkPrintDialogClosed, 500);
};
const QRCodePrintDesk = () => {
  // Open the popup window and store its reference
  printElement("deskQR"); // Assuming the element ID of your desk QR code is 'deskQR'
};

const QRCodePrintWall = () => {
  // Open the popup window and store its reference
  printElement("wallQR"); // Update this ID to match your wall QR code's element ID
};

const QRCodePrintOnlyHidden = () => {
  const para = document.getElementById("QrCodeOnlyParagraph");
  const qr = document.getElementById("QrCodeOnly");
  if (!para) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  if (!qr) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  para.style.visibility = "hidden";
  qr.style.visibility = "hidden";
};
const QRCodePrintOnlyShown = () => {
  const para = document.getElementById("QrCodeOnlyParagraph");
  const qr = document.getElementById("QrCodeOnly");
  if (!para) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  if (!qr) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  qr.style.visibility = "visible";
  para.style.visibility = "visible";
};

const PrinterQR = {
  QRCodePrintDesk,
  QRCodePrintWall,
  QRCodePrintOnlyHidden,
  QRCodePrintOnlyShown,
};

export default PrinterQR;
