import { ChangeEvent, useState } from "react";
import { ReactNode } from "react";
import "../App.css";
import printer from "../components/printerQR"; // Assuming printerQR file exists
import deskImage from "../assets/desk.jpg";
import wallImage from "../assets/wall.jpeg";
import Header from "../components/Header";
import { QRCodeWall, QRCodeDesk, QRCodeOnly } from "../components/QrCode";

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

  const uploadToDB = (state: "wall" | "desk") => {
    let qrCanvas = document.getElementById("qr-only") as HTMLCanvasElement;
    let dataUrl = qrCanvas.toDataURL("image/png");
    let formData = new FormData();

    formData.append("qr_image", dataUrl);
    formData.append("cm_from_ground", userInput.floorInput);
    formData.append("cm_out_of_wall", userInput.wallInput);
    formData.append("QR_placement_choice", state === "wall" ? "Wall" : "Desk"); // Correctly set QR_placement_choice

    fetch("http://localhost:8081/arapp/qrimage", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error uploading QR code:", error);
      });
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
                value="Print QR"
                onClick={() => placeIt("wall")}
              />
            </div>
            <div className="submit-button-container">
              <input
                type="submit"
                value="Upload QR to DB"
                onClick={() => uploadToDB("wall")}
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
                value="Print QR"
                onClick={() => placeIt("desk")}
              />
            </div>
            <div className="submit-button-container">
              <input
                type="submit"
                value="Upload QR to DB"
                onClick={() => uploadToDB("desk")}
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
      <canvas id="qr-only">
        <QRCodeOnly />
      </canvas>
    </>
  );
}

export default Home;
