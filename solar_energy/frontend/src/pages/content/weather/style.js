import { createUseStyles } from 'react-jss'

const useStyleWeather = createUseStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        // paddingTop: 0,
        height: '88vh',
        overflow: 'auto',
        gap: '15px'
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        padding: '10px 0'
    },
    card: {
        borderRadius: '15px',
        border: '1px solid #e7e7e7',
        display: 'flex',
        flexDirection: 'row',
        width: '300px',
        justifyContent: 'space-between',
        padding: '0 25px',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    chartContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    chart: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid #e7e7e7',
        width: '49%',
        borderRadius: '6px'
    },
    chartHeader: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        borderBottom: '1px solid #e7e7e7',
        padding: '15px'
    },
    chartContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        '& h3': {
            margin: 0
        }
    }
})

export default useStyleWeather