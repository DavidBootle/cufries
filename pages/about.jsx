/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head'
import LogoHeader from '@/components/LogoHeader/LogoHeader'
import styles from './about.module.css'

export default function About(props) {
    return (
        <>
            <Head>
                <title>About</title>
            </Head>
            <h1 className={styles.pageTitle}>About</h1>
            <div className={styles.container}>
                <div className={styles.sectionContainer}>
                    <img className={styles.sectionImage} src="/CUFries.svg" alt="CU Fries logo"/>
                    <div className={styles.textContainer}>
                        <h2 className={styles.sectionHeading}>What is CU Fries?</h2>
                        <p className={styles.sectionText}>
                        CU Fries is a platform designed to help students and faculty at Clemson University navigate the dining hall food options with ease. Upon loading the website, users are presented with a comprehensive list of food items offered at the university's dining halls. Users can then select their favorite foods to create a personalized list. On the main page, the selected foods are displayed along with their availability. If a selected food item is available on the current day, the platform shows which dining hall it can be found at and the specific serving time.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
                        
}