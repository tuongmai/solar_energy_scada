import { createUseStyles } from 'react-jss'

const useStyleProjectInfo = createUseStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
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

export default useStyleProjectInfo