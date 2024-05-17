import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import './App.css';
import useStore from './useStore';

const Layout = () => {
    const boards = useStore(state => state.boards);
    const activeBoardIndex = useStore(state => state.activeBoardIndex);
    const setActiveBoardIndex = useStore(state => state.setActiveBoardIndex);
    const addBoard = useStore(state => state.addBoard);
    const updateBoard = useStore(state => state.updateBoard);
    

    const setActiveBoard = (boardIndex) => {
        setActiveBoardIndex(boardIndex);
    };

    return (
        <div className="app">
            <Sidebar boards={boards} setActiveBoard={setActiveBoard} createBoard={addBoard} />
            <MainContent activeBoard={boards[activeBoardIndex]} updateBoard={(updatedBoard) => {
                updateBoard(activeBoardIndex, updatedBoard);
            }} />
        </div>
    );
};

export default Layout;
