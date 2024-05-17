import React, { useState, useEffect } from 'react';
import useStore from '../useStore';
import styles from './Sidebar.module.css';
import { ReactComponent as MoonIcon } from '../assets/images/moon.svg';
import { ReactComponent as SunIcon } from '../assets/images/sun.svg';
import { ReactComponent as HideIcon } from '../assets/images/hide.svg';
import { ReactComponent as SplitIcon } from '../assets/images/split.svg';
import { ReactComponent as ButtonSplitIcon } from '../assets/images/split.svg';

const Sidebar = () => {
    const boards = useStore(state => state.boards);
    const activeBoardIndex = useStore(state => state.activeBoardIndex);
    const setActiveBoardIndex = useStore(state => state.setActiveBoardIndex);
    const addBoard = useStore(state => state.addBoard);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const isSidebarVisible = useStore(state => state.isSidebarVisible);
    const setIsSidebarVisible = useStore(state => state.setIsSidebarVisible);

    useEffect(() => {
        document.body.classList.toggle('dark-theme', isDarkTheme);
        document.body.classList.toggle('light-theme', !isDarkTheme);
    }, [isDarkTheme]);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleThemeChange = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const handleAddBoard = () => {
        const boardName = prompt("Enter the name of the new board:");
        if (boardName) {
            addBoard(boardName);
        }
    };

    return (
        <aside className={`${styles.sidebar} ${isSidebarVisible ? '' : styles.hidden}`}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.logo}>kanban</h2>
                    <p className={styles.boardsCount}>ALL BOARDS ({boards.length})</p>
                    <ul className={styles.boardsList}>
                    {boards.map((board, index) => (
                        <li
                            key={index}
                            onClick={() => setActiveBoardIndex(index)}
                            className={`${styles.boardsListItem} ${index === activeBoardIndex ? styles.activeBoard : ''}`}
                        >
                            <div className={styles.splitImage}>
                                <SplitIcon className={styles.splitIcon}/>
                            </div>
                            {board.name}
                        </li>
                    ))}
                    <div className={styles.addBoardButton} onClick={handleAddBoard}>
                    <div className={styles.splitImage}>
                        <ButtonSplitIcon />
                    </div>
                    <p>+ Create New Board</p>
                </div>
                </ul>
                </div>
                <div className={styles.settingsToggle}>
                    <div className={styles.themeToggle}>
                        <div className={styles.themeImage}>
                            <SunIcon className={styles.themeIcon} />
                        </div>
                        <label className={styles.switch}>
                            <input type="checkbox" id="themeToggleCheckbox" checked={isDarkTheme} onChange={handleThemeChange} />
                            <span className={styles.slider}></span>
                        </label>
                        <div className={styles.themeImage}>
                            <MoonIcon className={styles.themeIcon} />
                        </div>
                    </div>
                    <div className={styles.hideBar} onClick={toggleSidebar}>
                        <div className={styles.hideBarImage}>
                            <HideIcon className={styles.hideIcon}/>
                        </div>
                        <p>Hide Sidebar</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
