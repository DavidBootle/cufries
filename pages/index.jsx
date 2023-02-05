import LogoHeader from '@/components/LogoHeader/LogoHeader';
import React, { useState } from 'react';
import FrySection from '@/components/FrySection/FrySection';
import axios from 'axios';
import Head from 'next/head';
import toast from "react-hot-toast";

export default class Landing extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { fries: [], loading: true };
      }
    
    componentDidMount() {
    // fetch data from menu-day
        axios.get("/api/menu-day", { timeout: 30000 })
        .then((response) => {
            if (response.data && response.data.items) {
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
                <LogoHeader />
                {this.state.loading ?
                <></> :
                <FrySection fries={this.state.fries}/>
                }
            </div>
        )
    }
}
