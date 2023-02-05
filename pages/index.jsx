import LogoHeader from '@/components/LogoHeader/LogoHeader';
import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import toast from "react-hot-toast";
const fs = require('fs/promises');


import dynamic from 'next/dynamic'
const FrySection = dynamic(() => import('@/components/FrySection/FrySection'), {
    ssr: false
})

export async function getServerSideProps(context) {
    let data = await fs.readFile("/tmp/day_menu.json", "utf-8").catch((err) => console.log(err));
    data = JSON.parse(data);
    let tmp = data.items;
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
    
    componentDidMount() {
    // fetch data from menu-day

        // check if preferences are set
        // if not redirect to settings
        let favorites = localStorage.getItem("favorites");
        
        if (!favorites || favorites == '[]') {
            window.location.href = "/settings";
        }
    }

    render() {
        return (
            <div>
                <Head>
                    <title>CU Fries</title>
                </Head>
                <LogoHeader showSettingsGear={true}/>
                {this.state.loading ?
                <></> :
                <FrySection fries={this.state.fries}/>
                }
            </div>
        )
    }
}
