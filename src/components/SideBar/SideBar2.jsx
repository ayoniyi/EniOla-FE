import Marquee from "react-fast-marquee";
import style from "./SideBar.module.scss";
import Logo from "./enny2.svg";

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
                  This is a conversational AI app called EniOla. You can either
                  type a message or speak to EniOla by recording a message.
                </p>
                <p>
                  EniOla might not speak to you depending on browser
                  compatibility, but would always type a response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar2;
