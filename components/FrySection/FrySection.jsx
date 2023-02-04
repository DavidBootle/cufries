import React, { useState } from "react";
import FryCard from "@/components/FryCard/FryCard";

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
  return (
    <div>
      <div>
        <h3>🍟 My Fries</h3>
      </div>
      {fries.map((fry, i) => {
        return <FryCard key={i} name={fry.name} />;
      })}
    </div>
  );
};

export default FrySection;
