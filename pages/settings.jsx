import LogoHeader from '@/components/LogoHeader/LogoHeader';
import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import toast from "react-hot-toast";
import styles from './settings.module.css';
const fs = require('fs/promises');

import dynamic from 'next/dynamic'
const FrySection = dynamic(() => import('@/components/FrySection/FrySection'), {
    ssr: false
})

export async function getServerSideProps(context) {
    let data = await fs.readFile("/tmp/all_food.json", "utf-8").catch((err) => console.log(err));
    data = JSON.parse(data);
    let tmp = data.items;
    console.log(tmp);
    tmp.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        if (a.name == b.name) return 0;
    })

    return {
        props: {fries: tmp}, // will be passed to the page component as props
    }
}

export default class Landing extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { fries: this.props.fries, loading: false };
      }

    render() {
        return (
            <div>
                <Head>
                    <title>CU Fries</title>
                </Head>
                <LogoHeader showSettingsGear={false}/>
                <div className={styles.promptText}>Select Foods to Track:</div>
                {this.state.loading ?
                <></> :
                <FrySection fries={this.state.fries} selectable={true} showSearchBar={true}/>
                }
            </div>
        )
    }
}
