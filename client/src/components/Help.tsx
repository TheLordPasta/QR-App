import "../App.css";
import Dropdown from "react-bootstrap/Dropdown";
import NavItem from "react-bootstrap/NavItem";
import NavLink from "react-bootstrap/NavLink";
function Help() {
  return (
    <>
      <Dropdown as={NavItem} id="dropdown-container">
        <Dropdown.Toggle as={NavLink} id="dropdown-navlink">
          more info
        </Dropdown.Toggle>
        <Dropdown.Menu id="dropdown-content">
          <Dropdown.Item>
            <h2>Wall instructions</h2>
            <div>
              <ol>
                <li>Print the QR code.</li>
                <li>
                  Place the QR on the<br></br> desired wall. It is<br></br>{" "}
                  mandatory to place <br></br>the center of the QR<br></br> at a
                  height (what<br></br> you entered in <br></br>centimeters)
                  from <br></br>the floor.
                </li>{" "}
              </ol>
            </div>
            <h2>Table guidelines</h2>
            <div>
              <ol>
                <li>Print the QR code.</li>
                <li>
                  Place on the desired<br></br> table. Pay attention<br></br> to
                  the arrows, the <br></br>character will turn<br></br> in the
                  direction of<br></br> the lower arrow.
                  <br></br>At the end there will<br></br> be a "next step"
                  <br></br>
                  button.
                </li>
              </ol>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default Help;
