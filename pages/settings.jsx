import LogoHeader from '@/components/LogoHeader/LogoHeader';
import React, { useState } from 'react';
import FrySection from '@/components/FrySection/FrySection';
import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator';
import axios from 'axios';
import Head from 'next/head';
import styles from './settings.module.css';

export default class Landing extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { fries: [], loading: true };
    }
    
    componentDidMount() {
    // fetch data from menu-day
        this.attemptLoad();
    }

    attemptLoad() {
        axios.get("/api/all-food", { timeout: 30000 })
        .then((response) => {
            if (response.status == 204) {
                this.setState({
                    loading: true,
                    generatingMenu: true
                });
                setTimeout(this.attemptLoad, 1000);
                return;
            }
            
            if (response.data) {
                let tmp = response.data;
                tmp.sort((a, b) => {
                    if (a.name > b.name) return 1;
                    if (a.name < b.name) return -1;
                    if (a.name == b.name) return 0;
                })
                tmp = tmp.map((value, index, array) => {
                    return {
                        name: value,
                    }
                })
                this.setState({
                    fries: tmp,
                    loading: false
                })
            }
        }) 
        .catch((err) => {
            setTimeout(this.attemptLoad, 1000);
        });
    }

    render() {
        return (
            <div>
                <Head>
                    <title>CU Fries</title>
                </Head>
                <LogoHeader showSettingsGear={false}/>
                { !this.state.loading && <div className={styles.promptText}>Select Foods to Track:</div>}
                {this.state.loading ?
                <LoadingIndicator generatingMenu={this.state.generatingMenu}/> :
                <FrySection fries={this.state.fries} selectable={true} showSearchBar={true}/>
                }
            </div>
        )
    }
}