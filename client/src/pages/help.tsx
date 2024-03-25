import "../App.css";
import Dropdown from "react-bootstrap/Dropdown";
import NavItem from "react-bootstrap/NavItem";
import NavLink from "react-bootstrap/NavLink";
function Help() {
  return (
    <>
      <Dropdown as={NavItem}>
        <Dropdown.Toggle as={NavLink}>
          Click for more information…
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>
            {/* <div className="container-help">
        <a href="#" className="slide-button">
          <img src="src\assets\help.png"></img>
          <div className="slide-button-info"> */}
            <h2>Wall instructions</h2>
            <p>
              <ol>
                <li>Print the QR code.</li>
                <li>
                  Place the QR on the desired wall.<br></br>It is mandatory to
                  place the center of the QR at a height<br></br> (what you
                  entered in centimeters) from the floor.
                </li>{" "}
              </ol>
            </p>
            <h2>Table guidelines</h2>
            <p>
              <ol>
                <li>Print the QR code.</li>
                <li>
                  Place on the desired table.<br></br>Pay attention to the
                  arrows, the character will turn<br></br> in the direction of
                  the lower arrow.
                  <br></br>At the end there will be a "next step" button.
                </li>
              </ol>
            </p>
            {/* </div>
        </a>
      </div> */}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default Help;
