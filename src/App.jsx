import { useEffect } from "react";
import useState from "react-usestateref";
import style from "./App.module.scss";
import InputBox from "./components/Input/InputBx";
import SideBar from "./components/SideBar/SideBar";
import SideBar2 from "./components/SideBar/SideBar2";
import TopBar from "./components/SideBar/TopBar";
import Enny from "./images/enny.svg";
import User from "./images/user.svg";

function App() {
  const [prompt, setPrompt, promptRef] = useState("");
  const [reply, setReply, replyRef] = useState();
  const [voices, setVoices, voicesRef] = useState([]);
  const [transcript, setTranscript, transcriptRef] = useState();

  const form = document.querySelector("form");
  const record = document.querySelector("#record");
  const chatContainer = document.querySelector("#chat_container");
  const synth = window.speechSynthesis;

  let loadInterval;

  const loader = (element) => {
    element.textContent = "";

    loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += ".";

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === "....") {
        element.textContent = "";
      }
    }, 300);
  };

  const typeText = (element, text) => {
    let index = 0;

    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  // generate unique ID for each message div of bot
  // necessary for typing text effect for that specific reply
  // without unique ID, typing text will work on every element
  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  function chatStripe(isAi, value, uniqueId) {
    return `
          <div class="wrapper ${isAi ? "ai" : "user"}">
              <div class="chat">
                  <div class="profile">
                  <img 
                  src=${isAi ? Enny : User} 
                  alt="${isAi ? "bot" : "user"}" 
                />
                  </div>
                  <div class="messages" id=${uniqueId}>${value}</div>
              </div>
          </div>
      `;
    // return(
    //   <div className="wrapper ${isAi && "ai"}">
    //             <div class="chat">
    //                 <div class="profile">
    //                 <img
    //                 src=${isAi ? Enny : User}
    //                 alt="${isAi ? "bot" : "user"}"
    //               />
    //                 </div>
    //                 <div className="messages" id=${uniqueId}>${value}</div>
    //             </div>
    //         </div>
    // )
  }

  const handleInput = (event) => {
    const { value } = event.target;
    //let letters = /[a-zA-Z]/;
    setPrompt(value);
  };

  useEffect(() => {
    const getVoices = () => {
      //voices =
      setVoices(synth.getVoices());
    };
    getVoices();
    synth.onvoiceschanged = getVoices;
  }, []);

  // Speak
  const aiSpeak = () => {
    // Check if speaking
    if (synth.speaking) {
      console.error("Already speaking...");
      return;
    }

    if (prompt !== "") {
      // Get speak text
      const speakText = new SpeechSynthesisUtterance(replyRef.current);

      // Speak end
      speakText.onend = (e) => {
        console.log("Done speaking...");
      };

      // Speak error
      speakText.onerror = (e) => {
        console.error("Something went wrong");
      };

      speakText.rate = 1;
      speakText.pitch = 0.7;
      speakText.lang = "en-GB";
      speakText.voice = voices[50];
      // Speak
      synth.cancel();
      synth.speak(speakText);
    }
  };

  const handleSubmit = async () => {
    //e.preventDefault();

    //const data = new FormData(form);

    // user's chatstripe
    //chatContainer.innerHTML += chatStripe(false, transcript);
    chatContainer.innerHTML += chatStripe(false, prompt);

    // to clear the textarea input
    //form.reset();
    setPrompt("");

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // to focus scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div
    const messageDiv = document.getElementById(uniqueId);

    // messageDiv.innerHTML = "..."
    loader(messageDiv);
    console.log("what im sending", prompt);
    const response = await fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        //prompt: transcript,
      }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = " ";

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
      console.log("aires>>", parsedData);
      setReply(parsedData);
      typeText(messageDiv, parsedData);
      aiSpeak();
    } else {
      const err = await response.text();

      messageDiv.innerHTML = "Something went wrong";
      alert(err);
    }

    // setReply(prompt);
    // typeText(messageDiv, prompt);
    // aiSpeak();
  };

  return (
    <>
      <SideBar />
      <TopBar />
      <div className={style.chatBody}>
        <div id="chat_container"></div>
      </div>
      <InputBox
        handleSubmit={handleSubmit}
        handleInput={handleInput}
        prompt={prompt}
      />
      <SideBar2 />
    </>
  );
}

export default App;
