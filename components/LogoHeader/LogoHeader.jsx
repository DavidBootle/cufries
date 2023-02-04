import React, { useState } from 'react';
import styles from "./LogoHeader.module.css";
import Image from 'next/image';

const LogoHeader = () => {


    return (
        <div className={'flex-col'}>
            <Image alt="CU Fries logo" src="/CUFries.svg" width={100} height={100} />
            <h2>CU Fries</h2>
            <h5>Find your favorite fries in Clemson dining halls.</h5>
        </div>
    )
}

export default LogoHeader;
