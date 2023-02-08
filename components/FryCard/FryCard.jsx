import React, { useState } from "react";
import styles from "./FryCard.module.css";
import Image from 'next/image';

function slightUpper(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default class FryCard extends React.Component {
  
  // PROPS
  // fry - fry item
  // selected - true or false
  // onSelection(fryId, state)
  // showBadge

  constructor(props) {
    super(props);
  }

  handleImageLoadFail(event) {
    // if image load failed, then substitute placeholder image
    event.target.src = '/images/_Placeholder.jpg';
  }

  render() {

    let scaleOnHoverClass = !this.props.selectable ? styles.scaleOnHover : styles.selectable;

    let selectedClass = this.props.selected ? styles.selected : '';

    return (
      <div onClick={() => {if (!this.props.showBadge) {this.props.onSelection(this.props.fry.id, this.props.selected ? false : true)}}} className={`${styles.card} ${selectedClass} ${scaleOnHoverClass}`}>
        <div className={styles.selectCircle}></div>
        <div className={styles.cardThumbnail}>
        <img
          src={`/images/${String(this.props.fry.name).replace(/ $/g, "")}.jpg`}
          alt={this.props.fry.name}
          onError={this.handleImageLoadFail}
        />
        </div>
        <div className={styles.cardDetails}>
          <h4 className={styles.cardTitle}>{this.props.fry.name}</h4>
          { this.props.showBadge ? 
          <div className={styles.badgeRow}>
            <div className={styles.badge}>{slightUpper(this.props.fry.location)}</div>
            {this.props.fry.time ?
            <div className={styles.badge}>{slightUpper(this.props.fry.time || '')}</div>
            : '' }
          </div>
          : '' }
        </div>
      </div>
    );
  }
}