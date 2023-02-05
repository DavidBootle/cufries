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

        // check if preferences are set
        // if not redirect to settings
        let favorites = localStorage.getItem("favorites");
        
        if (!favorites || favorites == '[]') {
            window.location.href = "/settings";
        }
        axios.get("/api/menu-day", { timeout: 30000 })
        .then((response) => {
            if (response.data && response.data.items) {

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
                <LogoHeader showSettingsGear={true}/>
                {this.state.loading ?
                <></> :
                <FrySection fries={this.state.fries}/>
                }
            </div>
        )
    }
}
