import { createUseStyles } from 'react-jss'

const useStyleHome = createUseStyles({
    page: {
        display: 'flex',
        flexDirection: 'row'
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        padding: '20px 40px',
        gap: '40px',
        '& .ant-table-thead .ant-table-cell': {
            backgroundColor: '#6495ed'
        }
    },
    map: {
        display: 'flex',
        justifyContent: 'center',
        height: '90vh',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        flexDirection: 'column'
    },
    infoImage: {
        display: 'block',
        position: 'absolute',
        bottom: '100px',
        left: '50px'
    }
})

export default useStyleHome