import "./App.css";
import MyRouter from "./router/index";
import { Navbar } from "./components/Navbar";


function App() {
  return (
    <div className="App">
      <Navbar />
      <MyRouter />
    </div>
  );
}

export default App;
