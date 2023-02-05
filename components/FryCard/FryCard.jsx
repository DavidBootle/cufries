import React, { useState } from "react";
import styles from "./FryCard.module.css";
import Image from 'next/image';

export default class FryCard extends React.Component {
  
  // PROPS
  // fry - fry item
  // selected - true or false
  // onSelection(fryId, state)
  // showBadge

  constructor(props) {
    super(props);
  }

  render() {

    let scaleOnHoverClass = !this.props.selectable ? styles.scaleOnHover : styles.selectable;

    let selectedClass = this.props.selected ? styles.selected : '';

    return (
      <div onClick={() => this.props.onSelection(this.props.fry.id, this.props.selected ? false : true)} className={`${styles.card} ${selectedClass} ${scaleOnHoverClass}`}>
        <div className={styles.selectCircle}></div>
        <div className={styles.cardThumbnail}>
        <img
          src={`/images/${String(this.props.fry.name).replace(/ $/g, "")}.jpg`}
          alt="image"
        />
        </div>
        <div className={styles.cardDetails}>
          <h4 className={styles.cardTitle}>{this.props.fry.name}</h4>
          { this.props.showBadge ? 
          <div className={styles.badgeRow}>
            <div className={styles.badge}>CORE - Lunch</div>
            <div className={styles.badge}>CORE - Dinner</div>
          </div>
          : '' }
        </div>
      </div>
    );
  }
}