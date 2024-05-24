import { createUseStyles } from 'react-jss'

const useStyleContent = createUseStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    title: {
        display: 'flex',
        fontSize: '1.75rem',
        color: '#2d8cf0',
        textAlign: 'center',
        gap: '10px',
        borderBottom: '1px solid #dee2e6',
        padding: '13px'
    }
})

export default useStyleContent