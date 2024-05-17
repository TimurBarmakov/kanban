import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import "./App.css"

const App = () => {
    // eslint-disable-next-line no-unused-vars
    const [boards, setBoards] = useState([
        { name: 'Platform Launch', tasks: {} },
        { name: 'Marketing Plan', tasks: {} },
        { name: 'Roadmap', tasks: {} },
    ]);
    
    const [selectedBoard, setSelectedBoard] = useState(boards[0]);

    return (
        <div className='layout'>
            <Sidebar boards={boards} setSelectedBoard={setSelectedBoard} />
            <MainContent selectedBoard={selectedBoard} />
        </div>
    );
};

export default App;
