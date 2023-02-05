import React, { useState } from "react";
import styles from "./FryCard.module.css";
import Image from "next/image";

const FryCard = (props) => {

  // PROPS:
  // selectable (true, false)

  let scaleOnHoverClass = !props.selectable ? styles.scaleOnHover : styles.selectable;

  const [selected, setSelected] = useState(false);

  function toggleSelected() {
    if (props.selectable) {
      setSelected(selected ? false : true);
    }
  }

  let selectedClass = selected ? styles.selected : '';

  return (
    <div onClick={toggleSelected} className={`${styles.card} ${selectedClass} ${scaleOnHoverClass}`}>
      <div className={styles.selectCircle}></div>
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
