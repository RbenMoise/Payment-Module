import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/test")
      .then((r) => {
        setMessage(r.data.message);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="App">
      <h1>My MERN Stack App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
