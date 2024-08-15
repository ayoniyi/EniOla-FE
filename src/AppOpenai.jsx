import { useEffect } from "react";
import useState from "react-usestateref";
import style from "./App.module.scss";
import InputBox from "./components/Input/InputBx";
import SideBar from "./components/SideBar/SideBar";
import SideBar2 from "./components/SideBar/SideBar2";
import TopBar from "./components/SideBar/TopBar";
import Enny from "./images/enny.svg";
import User from "./images/user.svg";

function AppOpenai() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply, replyRef] = useState();
  const [voices, setVoices] = useState([]);
  const [transcript, setTranscript, transcriptRef] = useState();
  const [recording, setRecording] = useState(false);

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

  // AI Speak
  const aiSpeak = () => {
    // Check if speaking
    if (synth.speaking) {
      console.error("Already speaking...");
      return;
    }

    //if (prompt !== "") {
    // Get speak text
    const tooLong = "Sorry I am not saying all of that";
    const speakText = new SpeechSynthesisUtterance(
      replyRef.current.length >= 252 ? tooLong : replyRef.current
    );

    // Speak end
    speakText.onend = (e) => {
      console.log("Done speaking...");
    };

    // Speak error
    speakText.onerror = (e) => {
      console.error("Something went wrong");
    };

    speakText.rate =
      replyRef.current.length >= 150 && replyRef.current.length < 252 ? 1.1 : 1;
    speakText.pitch = 0.7;
    speakText.lang = "en-GB";
    speakText.voice = voices[50];
    // Speak
    synth.cancel();
    synth.speak(speakText);
    //}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (navigator.onLine) {
      if (prompt !== "" && prompt.length >= 5) {
        // user's chatstripe
        //chatContainer.innerHTML += chatStripe(false, transcript);
        chatContainer.innerHTML += chatStripe(false, prompt);

        // to clear the textarea input
        setPrompt("");

        // bot's chatstripe
        const uniqueId = generateUniqueId();
        chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

        // to focus scroll to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // specific message div
        const messageDiv = document.getElementById(uniqueId);

        // messageDiv.innerHTML = "..."

        try {
          loader(messageDiv);
          console.log("what im sending", prompt);
          const response = await fetch(
            "https://odd-puce-betta-wrap.cyclic.app/",
            //"http://localhost:5000",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: prompt,
                //prompt: transcript,
              }),
            }
          );
          clearInterval(loadInterval);
          messageDiv.innerHTML = " ";
          const data = await response.json();
          const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
          //console.log("aires>>", parsedData);
          setReply(parsedData);
          aiSpeak();
          typeText(messageDiv, parsedData);
        } catch (err) {
          //const err = await response.text();
          clearInterval(loadInterval);
          messageDiv.innerHTML = " ";
          // messageDiv.innerHTML = "Sorry, something went wrong";
          // setReply("Sorry, something went wrong");
          messageDiv.innerHTML =
            "Sorry, I can't reply to that as you've run out of open AI credits";
          setReply(
            "Sorry, I can't reply to that as you've run out of open AI credits"
          );
          aiSpeak();
          //console.log(err);
        }

        // if (response.ok) {
        //   const data = await response.json();
        //   const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
        //   console.log("aires>>", parsedData);
        //   setReply(parsedData);
        //   aiSpeak();
        //   typeText(messageDiv, parsedData);
        // } else {
        //   const err = await response.text();

        //   messageDiv.innerHTML = "Something went wrong";
        //   alert(err);
        // }
      }
    } else {
      alert("Please check your internet connection");
    }
  };

  //User Speak
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onstart = () => {
    console.log("Speech activated, you can now speak");
    setRecording(true);
  };
  recognition.onresult = (event) => {
    //console.log(event);
    const current = event.resultIndex;
    setTranscript(event.results[current][0].transcript);
    // console.log(transcriptRef.current);
  };
  recognition.onend = () => {
    console.log("Speech Deactivated, you can shut up");
    setRecording(false);
    //console.log(transcriptRef.current);
    handleRecordEnd();
  };

  const handleRecord = () => {
    if (navigator.onLine) {
      recognition.start();
    } else {
      alert("Please check your internet connection");
    }
  };

  const handleRecordEnd = async () => {
    if (navigator.onLine) {
      if (
        transcriptRef?.current !== "" &&
        transcriptRef?.current?.length >= 5
      ) {
        // user's chatstripe
        chatContainer.innerHTML += chatStripe(false, transcriptRef.current);

        // bot's chatstripe
        const uniqueId = generateUniqueId();
        chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

        // to focus scroll to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // specific message div
        const messageDiv = document.getElementById(uniqueId);

        // messageDiv.innerHTML = "..."
        try {
          loader(messageDiv);
          //console.log("what im sending", transcriptRef.current);
          const response = await fetch(
            "https://odd-puce-betta-wrap.cyclic.app/",
            //"http://localhost:5000",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                prompt: transcriptRef.current,
              }),
            }
          );
          clearInterval(loadInterval);
          messageDiv.innerHTML = " ";
          const data = await response.json();
          const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
          //console.log("aires>>", parsedData);
          setReply(parsedData);
          aiSpeak();
          typeText(messageDiv, parsedData);
        } catch (err) {
          //const err = await response.text();
          clearInterval(loadInterval);
          messageDiv.innerHTML = " ";
          messageDiv.innerHTML =
            "Sorry, I can't reply to that as you've run out of open AI credits";
          setReply(
            "Sorry, I can't reply to that as you've run out of open AI credits"
          );
          aiSpeak();
          //console.log(err);
        }
        // loader(messageDiv);
        // console.log("what im sending", transcriptRef.current);
        // const response = await fetch("http://localhost:5000/", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     prompt: transcriptRef.current,
        //   }),
        // });

        // clearInterval(loadInterval);
        // messageDiv.innerHTML = " ";

        // if (response.ok) {
        //   const data = await response.json();
        //   const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
        //   console.log("AI res>>", parsedData);
        //   setReply(parsedData);
        //   aiSpeak();
        //   typeText(messageDiv, parsedData);
        // } else {
        //   const err = await response.text();
        //   messageDiv.innerHTML = "Something went wrong";
        //   alert(err);
        // }
      }
    } else {
      alert("Please check your internet connection");
    }
  };

  return (
    <>
      <div className="mMsg">
        <p>App can not be accessed on mobile, please view on desktop device.</p>
      </div>
      <div className="app">
        <SideBar />
        <TopBar recording={recording} />
        <div className={style.chatBody}>
          <div id="chat_container"></div>
        </div>
        <InputBox
          handleSubmit={handleSubmit}
          handleInput={handleInput}
          handleRecord={handleRecord}
          recording={recording}
          prompt={prompt}
        />
        <SideBar2 />
      </div>
    </>
  );
}

export default AppOpenai;
