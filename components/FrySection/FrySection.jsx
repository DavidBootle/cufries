import React, { useEffect, useState } from "react";
import FryCard from "@/components/FryCard/FryCard";
import styles from "./FrySection.module.css";


// PROPS
// fries - list of all items
export default class FrySection extends React.Component {

  render() {
    const fries = this.props.fries;
    
    let fryRows = [];

    if (fries && fries.length > 0) {
      for (let i = 0; i < fries.length; i += 3) {
        fryRows.push(fries.slice(i, i + 3));
      }
    }

    return (
      <div className={styles.FrySection}>
        {fries && fries.length > 0 ? (
          <>
            {fryRows.map((fryRow, i) => (
              <div key={i} className={styles.FryRow}>
                {fryRow.map((fry, j) => (
                  <FryCard key={j} name={fry.name} selectable={this.props.selectable}/>
                ))}
              </div>
            ))}
          </>
        ) : (
          <center>
            <p>No menu items found.</p>
          </center>
        )}
      </div>
    );
  }
}
