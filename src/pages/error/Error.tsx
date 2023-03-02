import React from "react";
import styles from "./Error.module.css";

export const ErrorPage: React.FC<any> = () => {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>路由不存在</p>
    </div>
  );
};