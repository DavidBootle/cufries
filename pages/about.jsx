/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head'
import LogoHeader from '@/components/LogoHeader/LogoHeader'
import styles from './about.module.css'
import Link from 'next/link'

export default function About(props) {
    return (
        <>
            <Head>
                <title>About</title>
            </Head>
            <h1 className={styles.pageTitle}>About</h1>
            <Link href="/" className={styles.backButton} title="Back">&larr;</Link>
            <div className={styles.container}>
                <div className={styles.sectionContainer}>
                    <img className={styles.sectionImage + ' ' + styles.hideOnMobile} src="/CUFries.svg" alt="CU Fries logo"/>
                    <div className={styles.textContainer}>
                        <h2 className={styles.sectionHeading}>What is CU Fries?</h2>
                        <p className={styles.sectionText}>
                        CU Fries is a platform designed to help students and faculty at Clemson University navigate the dining hall food options with ease. Upon loading the website, users are presented with a comprehensive list of food items offered at the university's dining halls. Users can then select their favorite foods to create a personalized list. On the main page, the selected foods are displayed along with their availability. If a selected food item is available on the current day, the platform shows which dining hall it can be found at and the specific serving time.
                        </p>
                    </div>
                </div>
                <div className={styles.sectionContainer}>
                    <div className={styles.textContainer}>
                        <h2 className={styles.sectionHeading}>How CU Fries Started</h2>
                        <p className={styles.sectionText}>
                        CU Fries was developed during the CUhackit 2023 hackathon in just 24 hours by David Bootle, Joey Meere, and Max Koon. The project earned the "Hack of the People" award. The name "CU Fries" originates from its initial focus on helping users find their favorite fries at different dining halls, which served as the foundation for the current, more comprehensive platform.
                        </p>
                    </div>
                    <img className={styles.sectionImage} src="/static_images/cu-hackit-2023.jpeg" alt="The creators accepting their award at CUhackit 2023." title="David Bootle, Joey Meere, and Max Koon accept their prizes for winning 'Hack of the People' at CUhackit 2023."/>
                </div>
                <div className={styles.sectionContainer}>
                    <img className={styles.sectionImage + ' ' + styles.hideOnMobile} src="/static_images/discord.png" alt="The CU Fries discord server." title="The CU Fries discord server."/>
                    <div className={styles.textContainer}>
                        <h2 className={styles.sectionHeading}>Continued Development</h2>
                        <p className={styles.sectionText}>
                        Since the hackathon, CU Fries has undergone continuous development to expand its features and improve user experience. David Bootle has taken the lead on implementing most changes, with Joey Meere and Max Koon providing ongoing support and valuable input. The <Link className={styles.link} href="https://discord.gg/V9bQktybtS">CU Fries Discord server</Link> serves as a community-driven space where users can report bugs, suggest new features, and engage directly with the developers to enhance the platform.
                        </p>
                    </div>
                </div>
                <div className={styles.sectionContainer}>
                    <div className={styles.textContainer}>
                        <h2 className={styles.sectionHeading}>Open Source</h2>
                        <p className={styles.sectionText}>
                        CU Fries is an open-source project, which means that its source code is <Link href="github.com/TheWeirdSquid/cufries" className={styles.link}>publicly available</Link> and encourages collaboration and contributions from developers and enthusiasts alike. This open-source approach fosters an interactive and collaborative environment, ensuring the platform continues to evolve and improve. By embracing community-driven development, CU Fries aims to provide a more refined and user-friendly experience for everyone at Clemson University.
                        </p>
                    </div>
                    <img className={styles.sectionImage + ' ' + styles.hideOnMobile} src="/static_images/github.png" alt="The github repository of CU Fries." title="The CU Fries Github repository."/>
                </div>
            </div>
        </>
    )
                        
}