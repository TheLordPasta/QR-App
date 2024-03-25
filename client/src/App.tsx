import "./App.css";
import Home from "./pages/home";
import Help from "./pages/help";
import { QRCodeWall, QRCodeDesk } from "./components/QrCode";

function App() {
  return (
    <div>
      <Home />
      <Help />
      <br></br>
      <br></br>
      <QRCodeDesk />
      <QRCodeWall />
    </div>
  );
}
export default App;
