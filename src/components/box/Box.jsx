import React from "react";
import style from "./Box.module.scss";

const Box = ({ children }) => {
  return (
    <>
      <div className={style.container}>{children}</div>
    </>
  );
};

export default Box;
