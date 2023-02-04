import LogoHeader from '@/components/LogoHeader/LogoHeader';
import React, { useState } from 'react';
import FrySection from '@/components/FrySection/FrySection';

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

export function Landing() {

    return (
        <div>
            <LogoHeader />
            <FrySection fries={fries} />
        </div>
    )
}

export default Landing;
