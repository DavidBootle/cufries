import LogoHeader from '@/components/LogoHeader/LogoHeader'
import LoadingIndicator from '@/components/LoadingIndicator/LoadingIndicator'

export default function Loading() {

    return (
        <>
            <LogoHeader showSettingsGear={true}/>
            <LoadingIndicator/>
        </>
    )
}