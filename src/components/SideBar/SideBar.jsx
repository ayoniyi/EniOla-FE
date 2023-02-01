import style from "./SideBar.module.scss";
import Logo from "./logoE.svg";

const SideBar = () => {
  return (
    <>
      <div className={style.container1}>
        <img className={style.appLogo} src={Logo} alt="logo" />
      </div>
    </>
  );
};

export default SideBar;
