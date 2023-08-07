import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import OtherPage from "./otherPage";
import Fib from "./fib";

function App() {

  return (
    <div className="App">
      <Router>
      <header className="App-header">
        <Link to="/">Home</Link>
        <Link to="/otherPage">Other Page</Link>
      </header>
        <Routes>
          <Route exact path="/" element={<Fib/>} />
          <Route path="/otherpage" element={<OtherPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
