import React, { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import AddTaskForm from './AddTaskForm';
import { ReactComponent as SettingsIcon } from '../assets/images/settingsIcon.svg';
import Modal from './Modal';
import useStore from '../useStore';
import styles from './MainContent.module.css';

const MainContent = () => {
    const [isAddTaskFormOpen, setAddTaskFormOpen] = useState(false);
    const activeBoardIndex = useStore(state => state.activeBoardIndex);
    const board = useStore(state => state.boards[activeBoardIndex]);
    const isSidebarVisible = useStore(state => state.isSidebarVisible);
    const setIsSidebarVisible = useStore(state => state.setIsSidebarVisible);

    const handleAddTask = () => {
        setAddTaskFormOpen(true);
    };

    const closeAddTaskForm = () => {
        setAddTaskFormOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className={`${styles.mainContent} ${isSidebarVisible ? '' : styles.withoutSidebar}`}>
            <div className={`${styles.mainContentHeader} ${isSidebarVisible ? '' : styles.withoutSidebarHeader}`}>
                <h3>{board.name}</h3>
                <div className={styles.headerSettings}>
                    <button className={styles.addTaskButton} onClick={handleAddTask}>+ Add New Task</button>
                    <div className={styles.settingsIcon} onClick={toggleSidebar}>
                        <SettingsIcon />
                    </div>
                </div>
            </div>
            <div className={styles.contentContainer}>
                <KanbanBoard />
                <Modal isOpen={isAddTaskFormOpen} onClose={closeAddTaskForm}>
                    <AddTaskForm onClose={closeAddTaskForm} />
                </Modal>
            </div>
        </div>
    );
};

export default MainContent;
