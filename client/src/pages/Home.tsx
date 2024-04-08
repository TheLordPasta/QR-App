import { ChangeEvent, useState } from "react";
import { ReactNode } from "react";
import "../App.css";
import printer from "../components/printerQR"; // Assuming printerQR file exists
import deskImage from "../assets/desk.jpg";
import wallImage from "../assets/wall.jpeg";
import Header from "../components/Header";
import { QRCodeWall, QRCodeDesk, QRCodeOnly } from "../components/QrCode";
import domtoimage from "dom-to-image";

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
  const uploadToDB = async (state: "wall" | "desk") => {
    const qrImage = document.getElementById("qr-only");

    if (!qrImage) {
      console.error("QR image element not found");
      return;
    } else {
      console.log("QR image was found");
    }

    try {
      const dataUrl = await domtoimage.toPng(qrImage);
      const blobData = await fetch(dataUrl).then((res) => res.blob());

      const formData = new FormData();
      formData.append("qr_image", blobData);

      if (userInput.wallInput && userInput.floorInput) {
        console.log("User input is Wall");
        formData.append("cm_from_ground", userInput.floorInput);
        formData.append("cm_out_of_wall", userInput.wallInput);
        formData.append("qr_placement_choice", "Wall");
      } else {
        console.log("User input is Desk");
        formData.append("qr_placement_choice", "Desk");
      }

      const response = await fetch("http://localhost:8081/arapp/qrimage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("QR uploaded successfully");
        setUserInput(initialState); // Reset user input after successful upload
      } else {
        console.error("Failed to upload QR");
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
      <div id="qr-only">
        <QRCodeOnly />
      </div>
    </>
  );
}

export default Home;
