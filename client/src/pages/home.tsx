import { ChangeEvent } from "react";
import { ReactNode } from "react";
import "../App.css";
import printer from "../components/printerQR";
import deskImage from "../assets/desk.jpg";
import wallImage from "../assets/wall.jpeg";
import { useState } from "react";
import Header from "../components/Header";

// Define the type for user input
interface UserInputType {
  wallInput: string;
  floorInput: string;
  selection: string;
  componentToRender: ReactNode; // Add this line
}

// Initial state for user input
const initialState = {
  wallInput: "",
  floorInput: "",
  selection: "",
  componentToRender: null,
};
function Home() {
  // State variables
  const [userInput, setUserInput] = useState<UserInputType>(initialState);
  const [activeDiv, setActiveDiv] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(wallImage);

  // Update wall input state
  const setWallInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, wallInput: e.target.value });
  };

  // Update floor input state
  const setFloorInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput({ ...userInput, floorInput: e.target.value });
  };

  const placeIt = (selection: "wall" | "desk") => {
    let component;
    console.log("Placing QR Code on:", userInput.selection.toString);
    if (selection == "wall") {
      printer.QRCodePrintWall();
      console.log(`wall`);
    } else if (selection == "desk") {
      printer.QRCodePrintDesk();
      console.log(`desk`);
    } else {
      console.log("selection invalid value");
    }
    setUserInput({ ...userInput, selection, componentToRender: component });
  };

  // Handle button click to set active div
  const handleButtonClick = (divId: string) => {
    setActiveDiv(divId);
    // let image = document.getElementById("display-draft") as HTMLImageElement; // Cast to HTMLImageElement for TypeScript

    // Determine which image to use based on the button clicked
    if (divId === "wallDiv") {
      setImageSrc(wallImage);
    } else if (divId === "tableDiv") {
      setImageSrc(deskImage);
    }
  };

  return (
    <>
      <Header />
      <h1>Design your QR Experience</h1>
      <div className="content">
        <div className="form-container">
          <h2>Where would you like to place the QR code?</h2>
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

          {/* Wall Div */}
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
                value="Place It"
                onClick={() => placeIt("wall")}
              />
              {userInput.componentToRender}
            </div>
          </div>
          {/* Table Div */}
          <div
            id="tableDiv"
            style={{ display: activeDiv === "tableDiv" ? "block" : "none" }}
          >
            <div className="submit-button-container">
              <input
                type="submit"
                value="Place It"
                onClick={() => placeIt("desk")}
              />
              {userInput.componentToRender}
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
    </>
  );
}

export default Home;
