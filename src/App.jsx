import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import Home from "./components/Home";
import Input from "./components/Input";
import { options, RequestType } from "./options";
import "./App.css";

function App() {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const [option, setOption] = useState({});
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [imgLink, setImgLink] = useState("");
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    setOption({});
    setLoading(false);
  };

  const selectOption = (option) => {
    setOption({ ...option, prompt: input });
  };

  const performAction = async () => {
    setLoading(true);
    var response;
    let object = { ...option.options, prompt: input };
    switch (option.type) {
      case RequestType.TEXT:
        response = await openai.createCompletion(object);
        setResult(response.data.choices[0].text);
        break;
      case RequestType.IMAGE:
        response = await openai.createImage(object);
        setImgLink(response.data.data[0].url);
        break;
    }
    setLoading(false);
  };

  console.log(option);

  return (
    <div className="app-main">
      {Object.values(option).length === 0 ? (
        <Home optionsList={options} selectOption={selectOption} />
      ) : (
        <Input
          option={option}
          performAction={performAction}
          setInput={setInput}
          result={result}
          imgLink={imgLink}
          goBack={goBack}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
