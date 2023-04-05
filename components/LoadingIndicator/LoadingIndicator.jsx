import styles from './LoadingIndicator.module.css';
import React from 'react';

export default class LoadingIndicator extends React.Component {

    constructor(props) {
        super(props);

        this.spinnerTimeout = null
        this.textTimeout = null

        this.state = {
            showSpinner: false,
            showText: false,
        }
    }

    componentDidMount() {
        // show spinner after 1 second and text after 3 seconds
        this.spinnerTimeout = setTimeout(() => {
            this.setState({ showSpinner: true })
        }, 1000);
        this.spinnerTimeout = setTimeout(() => {
            this.setState({ showText: true })
        }, 3000);
    }

    componentWillUnmount() {
        // if the component is unmounting clear the timeouts
        clearTimeout(this.spinnerTimeout);
        clearTimeout(this.textTimeout);
    }

    render() {
        let text = <>
            <h2 className={styles.loadingTitle}>{"Assembling the menu..."}</h2>
            <p className={styles.explanationText}>
                {"Congrats! You're the first one here today! We're loading today's menu for you, this usually takes around a minute. Feel free to come back later!"}
            </p>
        </>

        let spinner = <div className={styles.ldsRing}><div></div><div></div><div></div><div></div></div>



        return (
            <div className={styles.container}>
                { this.state.showSpinner && spinner }
                { this.state.showText && text }
            </div>
        )
    }
}