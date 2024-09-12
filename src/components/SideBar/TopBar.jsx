import style from "./SideBar.module.scss";
import Logo from "./enny3.JPG";

const TopBar = ({ recording }) => {
  return (
    <>
      <div className={style.containerTop}>
        <div className={style.contentTop}>
          <img src={Logo} alt="logo" />
          {recording && <p>recording...</p>}
        </div>
      </div>
    </>
  );
};

export default TopBar;
