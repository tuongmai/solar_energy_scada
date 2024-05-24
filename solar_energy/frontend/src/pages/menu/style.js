import { createUseStyles } from 'react-jss'

const useStyleMenu = createUseStyles({
    menu: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#343a40',
        width: '300px',
        height: '100vh',
        color: 'rgba(255, 255, 255, 0.8)',
        '& ul': {
            listStyle: 'none',
            padding: 0,
            margin: 0
        },
        '& li': {
            listStyle: 'none',
            margin: '6px 0',
            cursor: 'pointer'
        }
    },
    menuTitle: {
        fontSize: '1.25rem',
        padding: '18px 0 18px 8px',
        borderBottom: 'solid 1px #fff'
    },
    menuItem: {
        fontSize: '1rem',
        padding: '12px',
    },
    mainItem: {
        display: 'flex',
        gap: '12px',
        padding: '8px 16px'
    },
    subItem: {
        display: 'flex',
        gap: '12px',
        padding: '8px 16px 8px 40px',
        '& .circle': {
            border: '2px solid #fff',
            borderRadius: '50%',
            height: '12px',
            width: '12px'
        }
    },
    subsubItem: {
        display: 'flex',
        gap: '12px',
        padding: '8px 16px 8px 64px',
        '& .square': {
            border: '2px solid #fff',
            height: '12px',
            width: '12px'
        }
    }
})

export default useStyleMenu