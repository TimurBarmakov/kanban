import React, { useState, useRef } from 'react';
import styles from './KanbanBoard.module.css';
import useStore from '../useStore';
import EditTaskForm from './EditTaskForm';
import Modal from './Modal'; 

const KanbanBoard = () => {
    const activeBoardIndex = useStore(state => state.activeBoardIndex);
    const boards = useStore(state => state.boards);
    const addColumn = useStore(state => state.addColumn);
    const moveTask = useStore(state => state.moveTask);

    const [editingTask, setEditingTask] = useState(null);
    const [editingColumn, setEditingColumn] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const saveTaskRef = useRef(null);

    const board = boards[activeBoardIndex];

    if (!board) {
        return <div>No board selected or board does not exist.</div>;
    }

    const handleAddColumn = () => {
        const columnName = prompt("Enter the name of the new column:");
        if (columnName) {
            addColumn(activeBoardIndex, columnName);
        }
    };

    const handleDrop = (event, newStatus) => {
        event.preventDefault();
        const cardData = event.dataTransfer.getData("card");
        const oldStatus = event.dataTransfer.getData("status");
        const card = JSON.parse(cardData);
    
        if (oldStatus && newStatus && card) {
            const cardIndex = board.columns[oldStatus].findIndex(task => task.id === card.id);
            moveTask(activeBoardIndex, oldStatus, newStatus, card, board.columns[newStatus].length);
        }
    };    
    
    
    const handleDragStart = (event, status, card) => {
        event.dataTransfer.setData("card", JSON.stringify(card));
        event.dataTransfer.setData("status", status);
    };
    

    const getColorForColumn = (columnName) => {
        let hash = 0;
        for (let i = 0; i < columnName.length; i++) {
            hash = columnName.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        return color;
    };

    const handleCardClick = (task, column) => {
        console.log("Clicked task:", task); 
        setEditingTask(task);
        setEditingColumn(column);
        setIsEditFormOpen(true);
    };

    const closeEditForm = () => {
        setIsEditFormOpen(false);
        setEditingTask(null);
        setEditingColumn(null);
    };

    const handleSaveTask = (saveTaskFn) => {
        saveTaskRef.current = saveTaskFn;
    };

    const onModalClose = () => {
        if (saveTaskRef.current) {
            saveTaskRef.current();
        }
        closeEditForm();
    };

    return (
        <div className={styles.tasksList}>
            {Object.keys(board.columns).map((status) => (
                <div
                    className={styles.column}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, status, board.columns[status].length)}
                    key={status}
                >
                    <h4 style={{ '--dot-color': getColorForColumn(status) }}>
                        {status.toUpperCase()} ({board.columns[status].length})
                    </h4>
                    {board.columns[status].map((card, index) => (
                        <div
                            className={styles.card}
                            draggable
                            onDragStart={(event) => handleDragStart(event, status, card)}
                            onClick={() => handleCardClick(card, status)}
                            key={card.id}
                            data-index={index}
                        >
                            <div className={styles.cardTitle}>{card.title}</div>
                            <div className={styles.cardSubtasks}>
                                {`${card.subtasks.filter(subtask => subtask.completed).length} of ${card.subtasks.length} subtasks`}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleAddColumn} className={styles.newColumnButton}>+ New Column</button>
            {isEditFormOpen && (
                <Modal isOpen={isEditFormOpen} onClose={onModalClose} onSave={onModalClose}>
                    <EditTaskForm task={editingTask} column={editingColumn} onClose={closeEditForm} onSave={handleSaveTask} />
                </Modal>
            )}
        </div>
    );
};

export default KanbanBoard;
