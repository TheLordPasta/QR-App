import "./App.css";
import Home from "./pages/Home";
import { QRCodeWall, QRCodeDesk } from "./components/QrCode";

function App() {
  return (
    <div>
      <Home />
      <br></br>
      <br></br>
      <QRCodeDesk />
      <QRCodeWall />
    </div>
  );
}
export default App;
