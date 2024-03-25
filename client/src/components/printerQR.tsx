// Assuming you are still using TypeScript, you can define your props interface as needed.

const printElement = (elementId: string) => {
  const qr = document.getElementById(elementId);
  if (!qr) {
    console.error(`Element with id '${elementId}' not found.`);
    return;
  }
  console.log(`Element with id '${elementId}' found.`);
  //const originalContents = document.body.innerHTML; // Save the original page content
  qr.style.visibility = "visible";
  const printContents = qr.outerHTML; // Get the HTML of the element you want to print

  document.body.innerHTML = printContents; // Replace the page content with the print content
  window.print(); // Trigger the print dialog
  location.reload();
};

const QRCodePrintDesk = () => {
  printElement("deskQR"); // Assuming the element ID of your desk QR code is 'deskQR'
};

const QRCodePrintWall = () => {
  printElement("wallQR"); // Update this ID to match your wall QR code's element ID
};

const PrinterQR = {
  QRCodePrintDesk,
  QRCodePrintWall,
};

export default PrinterQR;
