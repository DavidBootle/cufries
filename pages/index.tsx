import LogoHeader from '@/components/LogoHeader/LogoHeader';
import React, { useState } from 'react';
import FrySection from '@/components/FrySection/FrySection';
import Head from 'next/head';

export function Landing() {

    return (
        <>
        <Head>
            <title>CU Fries</title>
        </Head>
        <div>
            <LogoHeader />
            <FrySection />
        </div>
        </>
    )
}

export default Landing;
