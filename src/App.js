import classes from "./App.module.css";
import { useRef, useState } from "react";
import data from "./data.json";

function App() {
  const inputRef = useRef();
  const [finalResult, setFinalResult] = useState("");
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const file = inputRef.current.files[0];
    if (!file) return;
    console.log(file.name);

    const fileDat = data.filter((item) => item.image === file.name)[0];

    if (!fileDat) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      // Use a regex to remove data url part
      const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

      const body = JSON.stringify({ image: base64String, result: fileDat.label });

      var response = await fetch("http://localhost:5000/image", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setFinalResult(json.result);
    };
    reader.readAsDataURL(file);
  };
  return (
    <>
      <form onSubmit={onSubmitHandler} className={classes.form}>
        <label>Input an image of 64x64</label>
        <input ref={inputRef} type={"file"} />
        <button>Submit</button>
      </form>
      {finalResult.length !== 0 && [
        <h4 key={1}>Model result :{finalResult} </h4>,
        <h3 key={2}>Final Result :{finalResult === 1 ? "covid positive" : "covid negative"}</h3>,
      ]}
    </>
  );
}

export default App;
