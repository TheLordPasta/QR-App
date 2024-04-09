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

const QRCodePrintOnlyHidden=()=>{
  const para=document.getElementById("QrCodeOnlyParagraph");
  const qr=document.getElementById("QrCodeOnly");
  if (!para) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  if (!qr) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  para.style.visibility="hidden";
  qr.style.visibility="hidden";
}
const QRCodePrintOnlyShown=()=>{
  const para=document.getElementById("QrCodeOnlyParagraph");
  const qr=document.getElementById("QrCodeOnly");
  if (!para) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  if (!qr) {
    console.error(`Element with id QrCodeOnly not found.`);
    return;
  }
  qr.style.visibility="visible";
  para.style.visibility="visible";
}

const PrinterQR = {
  QRCodePrintDesk,
  QRCodePrintWall,
  QRCodePrintOnlyHidden,
  QRCodePrintOnlyShown
};

export default PrinterQR;
