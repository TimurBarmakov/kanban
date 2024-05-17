import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../useStore';
import styles from './EditTaskForm.module.css';

const EditTaskForm = ({ task, column, onClose, onSave }) => {
    console.log("Task:", task);

    const activeBoardIndex = useStore(state => state.activeBoardIndex);
    const boards = useStore(state => state.boards);
    const updateBoard = useStore(state => state.updateBoard);

    // Removed unused setTaskTitle
    // const [taskTitle, setTaskTitle] = useState(task.title);
    // const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(column);

    const [subtasks, setSubtasks] = useState(() => {
        if (Array.isArray(task.subtasks)) {
            return task.subtasks.map(subtask => ({
                title: subtask.title || '', 
                completed: subtask.completed || false
            }));
        } else {
            return Object.entries(task.subtasks).map(([_, title]) => ({
                title,
                completed: false
            }));
        }
    });

    const handleSubtaskToggle = (index) => {
        const newSubtasks = subtasks.slice();
        newSubtasks[index].completed = !newSubtasks[index].completed;
        setSubtasks(newSubtasks);
    };

    const handleSaveTask = useCallback(() => {
        const updatedTask = {
            ...task,
            // Removed unused taskTitle
            // title: taskTitle,
            // description,
            subtasks,
        };

    
        const updatedColumns = { ...boards[activeBoardIndex].columns };
    
        if (column === status) {
            updatedColumns[status] = updatedColumns[status].map(t =>
                t.id === task.id ? updatedTask : t
            );
        } else {
            updatedColumns[column] = updatedColumns[column].filter(t => t.id !== task.id);
            updatedColumns[status].push(updatedTask);
        }
    
        updateBoard(activeBoardIndex, { columns: updatedColumns });
        onClose();
    }, [task, column, status, subtasks, boards, activeBoardIndex, updateBoard, onClose]);

    useEffect(() => {
        if (onSave) {
            onSave(handleSaveTask);
        }
    }, [onSave, handleSaveTask]);

    const completedSubtasksCount = subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasksCount = subtasks.length;

    return (
        <div className={styles.form}>
            <label className={styles.taskTitle}>{task.title}</label>
            <label>{task.description}</label>

            <label className={styles.subtasksLabel}>Subtasks ({completedSubtasksCount} of {totalSubtasksCount})</label>
            <ul className={styles.subtasksList}>
                {subtasks.map((subtask, index) => (
                    <li key={index} className={styles.subtask}>
                        <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() => handleSubtaskToggle(index)}
                        />
                        <span
                            className={subtask.completed ? styles.completed : ''}
                            onClick={() => handleSubtaskToggle(index)}
                        >
                            {subtask.title}
                        </span>
                    </li>
                ))}
            </ul>

            <label className={styles.statusLabel}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.keys(boards[activeBoardIndex].columns).map(columnKey => (
                    <option key={columnKey} value={columnKey}>{columnKey.toUpperCase()}</option>
                ))}
            </select>
        </div>
    );
};

export default EditTaskForm;
