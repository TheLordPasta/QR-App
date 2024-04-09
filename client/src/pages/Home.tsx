import { ChangeEvent, useState } from "react";
import { ReactNode } from "react";
import "../App.css";
import printer from "../components/printerQR"; // Assuming printerQR file exists
import deskImage from "../assets/desk.jpg";
import wallImage from "../assets/wall.jpeg";
import Header from "../components/Header";
import { QRCodeWall, QRCodeDesk, QRCodeOnly } from "../components/QrCode";
import domtoimage from "dom-to-image";
import html2canvas from "html2canvas";

interface UserInputType {
  wallInput: string;
  floorInput: string;
  selection: string;
  componentToRender: ReactNode | null; // Updated type
}

const initialState: UserInputType = {
  wallInput: "",
  floorInput: "",
  selection: "",
  componentToRender: null,
};

function Home() {
  const [userInput, setUserInput] = useState<UserInputType>(initialState);
  const [activeDiv, setActiveDiv] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(wallImage);

  const setWallInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, wallInput: e.target.value });
  };

  const setFloorInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, floorInput: e.target.value });
  };

  const placeIt = (selection: "wall" | "desk") => {
    let component = null; // Initialize component

    if (selection === "wall") {
      printer.QRCodePrintWall(); // Assuming printer has this method
      console.log(`Printing wall qr..`);
    } else if (selection === "desk") {
      printer.QRCodePrintDesk(); // Assuming printer has this method
      console.log(`Printing desk qr..`);
    } else {
      console.log("Invalid selection");
    }

    setUserInput({ ...userInput, selection, componentToRender: component });
  };

  const handleButtonClick = (divId: string) => {
    setActiveDiv(divId);

    if (divId === "wallDiv") {
      setImageSrc(wallImage);
    } else if (divId === "tableDiv") {
      setImageSrc(deskImage);
    }
  };
  // Inside uploadToDB function
  const uploadToDB = async (state: "wall" | "desk") => {
    printer.QRCodePrintOnlyShown();
    const qrImageDiv = document.getElementById("qr-only");
    if (!qrImageDiv) {
      console.error("QR image div element not found");
      return;
    }

    try {
      const canvas = await html2canvas(qrImageDiv, {
        scale: 2, // Adjust scale as needed
        useCORS: false, // Set useCORS to false
      });
      printer.QRCodePrintOnlyHidden();
      // Debugging: Check canvas size
      console.log("Canvas size:", canvas.width, "x", canvas.height);

      // Convert canvas to Blob
      const blobData = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });

      if (!blobData) {
        console.error("Failed to convert canvas to Blob");
        return;
      }

      // Debugging: Check Blob size and type
      console.log("Blob size:", blobData.size);
      console.log("Blob type:", blobData.type);

      const formData = new FormData();
      formData.append("qr_image", blobData, "qr_image.png");

      if (userInput.wallInput && userInput.floorInput) {
        console.log("User input is Wall");
        formData.append("cm_from_ground", userInput.floorInput);
        formData.append("cm_out_of_wall", userInput.wallInput);
        formData.append("qr_placement_choice", "Wall");
      } else {
        console.log("User input is Desk");
        formData.append("qr_placement_choice", "Desk");
      }

      // Debugging: Check FormData contents
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch("http://localhost:8081/arapp/qrimage", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json(); // Assuming server responds with JSON data

      if (response.ok) {
        console.log("QR uploaded successfully");
        setUserInput(initialState); // Reset user input after successful upload
      } else {
        console.error(
          "Failed to upload QR:",
          responseData.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error uploading QR code:", error);
    }
  };

  return (
    <>
      <Header />
      <h1>Design your QR Experience</h1>
      <div className="content">
        <div className="form-container">
          <h1>Where would you like to place the QR code?</h1>
          <div>
            <button
              className="top-button"
              type="button"
              name="wallButton"
              onClick={() => handleButtonClick("wallDiv")}
            >
              Wall
            </button>

            <button
              className="top-button"
              type="button"
              name="tableButton"
              onClick={() => handleButtonClick("tableDiv")}
            >
              Table
            </button>
          </div>

          <div
            id="wallDiv"
            style={{ display: activeDiv === "wallDiv" ? "block" : "none" }}
          >
            <label htmlFor="cm_from_ground">Enter cm from the ground:</label>
            <input
              type="number"
              onChange={(e) => setFloorInput(e)}
              name="cm_from_ground"
              id="cm_from_ground"
              required
            />
            <br></br>
            <label htmlFor="cm_out_of_wall">Enter cm out of the wall:</label>
            <input
              type="number"
              onChange={(e) => setWallInput(e)}
              name="cm_out_of_wall"
              id="cm_out_of_wall"
              required
            />
            <div className="submit-button-container">
              <input
                type="submit"
                value="Upload QR to DB"
                onClick={() => uploadToDB("wall")}
              />
            </div>
            <div className="submit-button-container">
              <input
                type="submit"
                value="Print QR"
                onClick={() => placeIt("wall")}
              />
            </div>
          </div>

          <div
            id="tableDiv"
            style={{ display: activeDiv === "tableDiv" ? "block" : "none" }}
          >
            <div className="submit-button-container">
              <input
                type="submit"
                value="Upload QR to DB"
                onClick={() => uploadToDB("desk")}
              />
            </div>
            <div className="submit-button-container">
              <input
                type="submit"
                value="Print QR"
                onClick={() => placeIt("desk")}
              />
            </div>
          </div>
        </div>
        <div className="form-container" id="display-draft">
          <img
            id="display-draft"
            src={imageSrc}
            alt="Pic helping to fill info"
            className="resizable-image"
          />
        </div>
      </div>

      <QRCodeDesk />
      <QRCodeWall />
      <div
        id="qr-only"
        style={{
          width: "240px",
          height: "240px",
        }}
      >
        <QRCodeOnly />
      </div>
    </>
  );
}

export default Home;
