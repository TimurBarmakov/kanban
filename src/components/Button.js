import React from 'react';
import styles from './Button.module.css';

const Button = ({ onClick, color, children, className }) => {
    return (
        <button className={`${styles.Button} ${styles[color]} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

Button.defaultProps = {
    color: 'default',
};

export default Button;
