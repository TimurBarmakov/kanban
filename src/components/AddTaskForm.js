import React, { useState } from 'react';
import useStore from '../useStore';
import styles from './AddTaskForm.module.css';
import Button from './Button';


const AddTaskForm = ({ onClose }) => {
    const activeBoardIndex = useStore(state => state.activeBoardIndex);
    const addTaskToColumn = useStore(state => state.addTaskToColumn);
    const boards = useStore(state => state.boards);

    
    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [subtasks, setSubtasks] = useState(['']);

    const generateId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const handleAddSubtask = () => {
        setSubtasks([...subtasks, '']);
    };

    const handleSubtaskChange = (index, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = value;
        setSubtasks(newSubtasks);
    };

    const handleRemoveSubtask = (index) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    const handleCreateTask = () => {
        if (taskTitle) {
            const taskId = generateId();
            addTaskToColumn(activeBoardIndex, status, taskTitle, description, subtasks, taskId);
            onClose();
        }
    };

    const activeBoard = boards[activeBoardIndex];
    const columnNames = Object.keys(activeBoard.columns);

    return (
        <div className={styles.form}>
            <h2>Add New Task</h2>
            <label>Title</label>
            <input 
                type="text" 
                value={taskTitle} 
                onChange={(e) => setTaskTitle(e.target.value)} 
                placeholder="e.g. Take coffee break" 
            />
            <label>Description</label>
            <input 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little." 
            />
            <label>Subtasks</label>
            {subtasks.map((subtask, index) => (
                <div key={index} className={styles.subtask}>
                    <input 
                        type="text" 
                        value={subtask} 
                        onChange={(e) => handleSubtaskChange(index, e.target.value)} 
                        placeholder={`Subtask ${index + 1}`} 
                    />
                    <button onClick={() => handleRemoveSubtask(index)} className={styles.removeSubtaskButton}>X</button>
                </div>
            ))}
            <Button onClick={handleAddSubtask} color="default">+ Add New Subtask</Button>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {columnNames.map(columnName => (
                    <option key={columnName} value={columnName}>{columnName.toUpperCase()}</option>
                ))}
            </select>
            <Button onClick={handleCreateTask} color="primary">Create Task</Button>
        </div>
    );
};

export default AddTaskForm;
