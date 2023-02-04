import React, { useState } from "react";
import FryCard from "@/components/FryCard/FryCard";

const FrySection = (fries) => {
  console.log(fries);
  return (
    <div>
      <div>
        <h4>🍟 My Fries</h4>
      </div>
      {fries.fries.map((fry) => {
        <FryCard fry={fry} />;
      })}
    </div>
  );
};

export default FrySection;
