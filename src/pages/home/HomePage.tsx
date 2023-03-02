import React, { useEffect } from "react";
import styles from "./HomePage.module.css";
import { Outlet } from "react-router-dom";
import { Header, LeftMenu, Footer } from "../../compenents";
import { login } from "../../api/index";

export const HomePage: React.FC = () => {
  useEffect(() => {
    login.login("1@qq.com", "123123", "1", "2");
  }, []);

  return (
    <>
      <div className={styles["layout-wrap"]}>
        <div className={styles["left-menu"]}>
          <LeftMenu />
        </div>
        <div className={styles["right-cont"]}>
          <div className={styles["right-top"]}>
            <Header></Header>
          </div>
          <div className={styles["right-main"]}>
            {/* 二级路由出口 */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};