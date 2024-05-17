import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(persist((set) => ({
    boards: [
        {
            name: 'Platform Launch',
            columns: {
                todo: [],
                doing: [],
                done: [],
            },
        },
        {
            name: 'Marketing Plan',
            columns: {
                todo: [],
                doing: [],
                done: [],
            },
        },
        {
            name: 'Road Map',
            columns: {
                todo: [],
                doing: [],
                done: [],
            },
        }
    ],
    activeBoardIndex: 0,
    setActiveBoardIndex: (index) => set({ activeBoardIndex: index }),
    addBoard: (name) => set((state) => ({
        boards: [...state.boards, { name, columns: { todo: [], doing: [], done: [] } }]
    })),
    updateBoard: (index, updatedBoard) => set((state) => {
        const newBoards = state.boards.map((board, i) => i === index ? {...board, ...updatedBoard} : board);
        return { boards: newBoards };
    }),
    addTaskToColumn: (boardIndex, column, taskTitle, taskDescription, subtasks) => set(state => {
        const taskId = '_' + Math.random().toString(36).substr(2, 9);
        console.log('New Task ID:', taskId);

        const formattedSubtasks = subtasks.map(subtask => {
            if (typeof subtask === 'object' && subtask.title) {
                return subtask;
            } else {
                return { title: subtask };
            }
        });

        const boards = state.boards.map((board, i) => {
            if (i === boardIndex) {
                return {
                    ...board,
                    columns: {
                        ...board.columns,
                        [column]: [...board.columns[column], { id: taskId, title: taskTitle, description: taskDescription, subtasks: formattedSubtasks }]
                    }
                };
            }
            return board;
        });
        return { boards };
    }),

    addColumn: (boardIndex, columnName) => set((state) => {
        const boards = state.boards.map((board, i) => {
            if (i === boardIndex) {
                return {
                    ...board,
                    columns: {
                        ...board.columns,
                        [columnName]: []
                    }
                };
            }
            return board;
        });
        return { boards };
    }),
    
    moveTask: (boardIndex, fromColumn, toColumn, card, newIndex) => set((state) => {
        const boards = state.boards.map((board, i) => {
            if (i === boardIndex) {
                const fromTasks = [...board.columns[fromColumn]];
                const toTasks = [...board.columns[toColumn]];
    
                const taskIndex = fromTasks.findIndex(task => task.id === card.id);
    
                if (taskIndex > -1) {
                    const movedTask = fromTasks.splice(taskIndex, 1)[0];
    
                    if (fromColumn === toColumn) {
                        if (newIndex !== undefined && newIndex !== taskIndex) {
                            fromTasks.splice(newIndex, 0, movedTask);
                        } else {
                            fromTasks.push(movedTask);
                        }
                        return {
                            ...board,
                            columns: {
                                ...board.columns,
                                [fromColumn]: fromTasks,
                            }
                        };
                    } else {
                        toTasks.splice(newIndex, 0, movedTask);
    
                        return {
                            ...board,
                            columns: {
                                ...board.columns,
                                [fromColumn]: fromTasks,
                                [toColumn]: toTasks,
                            }
                        };
                    }
                }
            }
            return board;
        });
        return { boards };
    }),
    

    updateTaskStatus: (boardIndex, fromColumn, toColumn, card) => set((state) => {
        const boards = state.boards.map((board, i) => {
            if (i === boardIndex) {
                const fromTasks = [...board.columns[fromColumn]];
                const toTasks = [...board.columns[toColumn]];

                const taskIndex = fromTasks.findIndex(task => task.id === card.id);

                if (taskIndex > -1) {
                    const movedTask = fromTasks[taskIndex];
                    movedTask.status = toColumn; 

                    fromTasks.splice(taskIndex, 1);
                    toTasks.push(movedTask); 

                    return {
                        ...board,
                        columns: {
                            ...board.columns,
                            [fromColumn]: fromTasks,
                            [toColumn]: toTasks
                        }
                    };
                }
            }
            return board;
        });
        return { boards };
    }),

    isSidebarVisible: true,
    setIsSidebarVisible: (isVisible) => set({ isSidebarVisible: isVisible })
}), {
    name: 'kanban-storage',
}));

console.log('Initial State:', useStore.getState());

export default useStore;
