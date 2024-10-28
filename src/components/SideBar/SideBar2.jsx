import Marquee from "react-fast-marquee";
import style from "./SideBar.module.scss";
import Logo from "./enny3.JPG";

const SideBar2 = () => {
  return (
    <>
      <div className={style.container2}>
        <div className={style.content}>
          <div className={style.top}>
            <img src={Logo} alt="logo" />
            <div className={style.title}>
              <h1>EniOla</h1>
              <p>The AI</p>
            </div>
          </div>
          <div className={style.bottom}>
            <div className={style.btmText}>
              <div className={style.btmTextC}>
                <p>
                  This is a conversational AI app. <br />
                  You can either type a message or record a message. <br />
                </p>
                <p>
                  {" "}
                  <span>
                    {" "}
                    Click the mic to record and once you stop talking your
                    message is automatically sent.
                  </span>
                </p>
                {/* <p>
                  EniOla might not speak to you depending on browser
                  compatibility, but would always type a response.
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar2;
