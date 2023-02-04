import React, { useState } from "react";
import FryCard from "@/components/FryCard/FryCard";
import styles from './FrySection.module.css';

const fries = [
  {
    name: "Homestyle French Fries",
    description: "This is a french fry.",
  },
  {
    name: "Crinkle Cut French Fries",
    description: "This is a french fry.",
  },
  {
    name: "Shoestring French Fries",
    description: "This is a french fry.",
  },
  {
    name: "Sweet Potato French Fries",
    description: "This is a french fry.",
  },
];

const FrySection = () => {
  const fryRows = [];
  for (let i = 0; i < fries.length; i += 3) {
    fryRows.push(fries.slice(i, i + 3));
  }

  return (
    <div className={styles.FrySection}>
      {fryRows.map((fryRow, i) => (
        <div key={i} className={styles.FryRow}>
          {fryRow.map((fry, j) => (
            <FryCard key={j} name={fry.name} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default FrySection;
