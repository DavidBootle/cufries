import React, { useState } from 'react';
import styles from "./logoheader.module.css";

const LogoHeader = () => {


    return (
        <div className={styles.bg}>
            <img src="/CUFries.svg" width={"100px"} height={"150px"} />
            <br></br>
            <h2 className={styles.title}>CUFries</h2>
            <h5 color='gray'>Find your favorite fries in Clemson dining halls.</h5>
        </div>
    )
}

export default LogoHeader;
