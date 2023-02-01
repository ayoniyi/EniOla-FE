import style from "./InputBx.module.scss";
import Mic from "./mic.svg";
import Send from "./send.png";

const InputBox = ({ handleSubmit, handleInput, prompt }) => {
  return (
    <>
      <div className={style.container}>
        <div className={style.micCircle}>
          <img id="record" src={Mic} alt="microphone" />
        </div>
        <div className={style.formBx}>
          <form>
            {/* <textarea
              name="prompt"
              rows="1"
              cols="1"
              // placeholder="Ask Eni..."
            ></textarea> */}
            <input
              type="text"
              placeholder="Talk to me..."
              name="prompt"
              value={prompt}
              onChange={handleInput}
            />
            <div className={style.submitText}>
              <img
                className={style.send}
                src={Send}
                alt="send"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InputBox;
