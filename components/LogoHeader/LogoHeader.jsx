import React, { useState } from 'react';
import styles from "./LogoHeader.module.css";
import Image from 'next/image';

const LogoHeader = () => {

    return (
        <div className={styles.header}>
            <Image alt="CU Fries logo" src="/CUFries.svg" className={styles.logo} width={100} height={100}/>
            <h2 className={styles.headerTitle}>CU Fries</h2>
            <h5 className={styles.headerSubtitle}>Find your favorite fries in Clemson dining halls.</h5>
        </div>
    )
}

export default LogoHeader;
