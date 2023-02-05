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

const FrySection = () => {
  const [fries, setFries] = useState([]);

  async function getMenu() {
    const response = await axios.get("/api/menu-day");

    console.log(response);
    console.log(response.body.items);

    const data = JSON.stringify(response.body.items);

    setFries(data);

    return data;
  }

  useEffect(() => {
    getMenu().then((res) => {
      console.log(res);
    });
  }, []);

  const fryRows = [];

  if (fries.length > 0) {
    for (let i = 0; i < fries.length; i += 3) {
      fryRows.push(fries.slice(i, i + 3));
    }
  } else {
    toast.error("Failed to fetch.");
  }

  return (
    <div className={styles.FrySection}>
      {fries.length > 0 ? (
        <center>
          <p>No menu items found.</p>
        </center>
      ) : (
        <>
          {fryRows.map((fryRow, i) => (
            <div key={i} className={styles.FryRow}>
              {fryRow.map((fry, j) => (
                <FryCard key={j} name={fry.name} />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FrySection;
