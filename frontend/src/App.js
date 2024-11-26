import "./App.css";
import QrCodeGenerator from "./components/generator/ganerator";
import OfferingForm from "./components/offering/Offering";

function App() {
  return (
    <div className="App">
      <p>Welcome home</p>
      <QrCodeGenerator></QrCodeGenerator>
      <OfferingForm></OfferingForm>
    </div>
  );
}

export default App;
