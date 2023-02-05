import LogoHeader from '@/components/LogoHeader/LogoHeader';
import React, { useState } from 'react';
import FrySection from '@/components/FrySection/FrySection';
import axios from 'axios';
import Head from 'next/head';
import toast from "react-hot-toast";
import styles from './settings.module.css';

export default class Landing extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { fries: [], loading: true };
      }
    
    componentDidMount() {
    // fetch data from menu-day
        axios.get("/api/all-food", { timeout: 30000 })
        .then((response) => {
            console.log(response);
            if (response.data && response.data.items) {
                let tmp = response.data.items;
                tmp.sort((a, b) => {
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    if (a.name == b.name) return 0;
                })
                this.setState({
                    fries: response.data.items,
                    loading: false
                })
            }
        }) 
        .catch((err) => {
            toast.error(`Failed to fetch with ${err}`);
            this.setState({ loading: false} )
        });
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
