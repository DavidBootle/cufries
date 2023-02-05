import React, { useEffect, useState } from "react";
import FryCard from "@/components/FryCard/FryCard";
import styles from "./FrySection.module.css";
import toast from "react-hot-toast";
import axios from "axios";

/*
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
*/

export default class FrySection extends React.Component {

  constructor(props) {
    super(props);

    this.state = { fries: [] };
  }

  componentDidMount() {
    // fetch data from menu-day
    axios.get("/api/menu-day", { timeout: 30000 })
    .then((response) => {
      if (response.data && response.data.items) {
        this.setState({
          fries: response.data.items
        })
      }
    }) 
    .catch((err) => {
      toast.error(`Failed to fetch with ${err}`);
    });
  }

  render() {
    const fries = this.state.fries;
    
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
                  <FryCard key={j} name={fry.name} />
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
