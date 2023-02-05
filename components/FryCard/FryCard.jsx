import React, { useState } from "react";
import styles from "./FryCard.module.css";
import Image from "next/image";

const FryCard = (props) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardThumbnail}>
        <img src="https://i.imgur.com/dxOjhM3.jpg" alt="fries" />
      </div>
      <div className={styles.cardDetails}>
        <h4 className={styles.cardTitle}>{props.name}</h4>
        <div className={styles.badgeRow}>
          <div className={styles.badge}>CORE - Lunch</div>
          <div className={styles.badge}>CORE - Dinner</div>
        </div>
      </div>
    </div>
  );
};

export default FryCard;
