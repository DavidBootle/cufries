import React, { useState } from "react";
import styles from "./FryCard.module.css";

const FryCard = (name) => {
  const [selected, setSelected] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.cardtumb}>
        <img src="https://i.imgur.com/dxOjhM3.jpg" alt="" />
      </div>
      <div className={styles.carddetails}>
        <h4 className={styles.cardtitle}>
          <a onClick={() => setSelected(true)}>{String(name.name)}</a>
        </h4>
        <div className={styles.cardbottomdetails}>
          <div className={styles.badge}>Core</div>
          <div className={styles.cardlinks}>
            <a href="">
              <i className="fa fa-heart"></i>
            </a>
            <a href="">
              <i className="fa fa-shopping-cart"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FryCard;
