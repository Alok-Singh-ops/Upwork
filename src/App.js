import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import API from "./api/API";
import Home from "./pages/Home";
import { CircularProgress } from "@mui/material";

function App() {
  const [isLoding, setIsLoding] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await API.get("getTableFields?tablename=tbtax");
        const data = response.data?.data;
        setData(data);
        setIsLoding(false);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  return (
    <div className="App">
      {isLoding ? <CircularProgress /> : <Home data={data} />}
    </div>
  );
}

export default App;
