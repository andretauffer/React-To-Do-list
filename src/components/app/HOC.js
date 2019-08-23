import React, { useReducer, useRef, useEffect } from 'react'
import toggleOff from './images/switch (1).svg'
import toggleOn from './images/switch.svg'
import backgroundGradFx from './toggleLight'

const initialState = {
    title: '',
    description: '',
    developer: '',
    status: '',
    error: '',
    showTrash: false,
    store: [],
    difficulty: 0,
    sorted: false,
}

const HOCreducer = (state, action) => {
    switch (action.type) {
        case 'field':
            return {
                ...state,
                [action.field]: action.value,
            }
        case 'created':
            return {
                ...state,
                status: 'created',
                title: '',
                description: '',
                developer: '',
                error: '',
                difficulty: 0,
                store: action.value
            }
        case 'update':
            return {
                ...state,
                store: action.value,
            }
        case 'sorted':
            return{

                ...state,
                sorted: true,
                store: action.value,
            }
        case 'error':
            return {
                ...state,
                error: 'You should have a title for the task'
            }
        case 'showTrash':
            return {
                ...state,
                showTrash: true
            }
        case 'hideTrash':
            return {
                ...state,
                showTrash: false
            }

        default:
            break;
    }
}

export default Component => {
    const GetFormData = (props) => {
        const [state, dispatch] = useReducer(HOCreducer, initialState);
        const { title, developer, description, error, status, showTrash, difficulty, sorted, store } = state;
        const currentDevField = useRef(null);
        const currentDescField = useRef(null);
        const readFromStorage = () => {
            let list = localStorage.getItem('list');
            list !== null ? list = JSON.parse(list) : list = [];
            return list;
        }

        useEffect(() => {
            dispatch({type: 'update', value: readFromStorage()})
        }, [])
        
        console.log('is this really?', store);
        const sortedList = store;
       
        const sortList = () => {
            sortedList.sort((a, b) => (Number(a.difficulty) > (b.difficulty)) ? 1 : -1 )
            console.log('called', sortedList)
            dispatch({type: 'sorted', value: sortedList})
        }

        const createTask = () => {
            let id = Math.round(Math.random() * 1000);
            if (title !== '') {
                store.push({
                    title: title,
                    developer: developer,
                    description: description,
                    status: 'created',
                    id,
                    difficulty,
                });
            } else {
                dispatch({ type: 'error' });
            }
            localStorage.setItem('list', JSON.stringify(store));
            dispatch({ type: 'created', value: store });
            console.log('whyyyy', store);
        }

        const cleanStorage = () => {
            localStorage.removeItem('list');
            dispatch({ type: 'update', value: [] })
        }

        const updateTask = (e, action) => {
            const elementId = Number(e.currentTarget.parentElement.parentElement.id);
            const updatedTaskList = store.map(el => {
                if (el.id === elementId) {
                    switch (action.type) {
                        case 'update':
                            let actualDev = '';
                            let actualDesc = '';
                            console.log(' in update', currentDescField.current);
                            currentDevField.current ? actualDev = currentDevField.current.value : actualDev = el.developer;
                            currentDescField.current ? actualDesc = currentDescField.current.value : actualDesc = el.description;
                            return el = { title: el.title, developer: actualDev, description: actualDesc, status: el.status, id: el.id, difficulty: el.difficulty };
                        case 'delete':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'deleted', id: el.id, difficulty: el.difficulty };
                        case 'clearDevField':
                            return el = { title: el.title, developer: '', description: el.description, status: el.status, id: el.id, difficulty: el.difficulty };
                        case 'clearDescField':
                            return el = { title: el.title, developer: el.developer, description: '', status: el.status, id: el.id, difficulty: el.difficulty };
                        case 'on-hold':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'on-hold', id: el.id, difficulty: el.difficulty };
                        case 'completed':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'completed', id: el.id, difficulty: el.difficulty };
                        case 'active':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'active', id: el.id, difficulty: el.difficulty };
                        default:
                            break;
                    }
                }
                return el
            })
            localStorage.setItem('list', JSON.stringify(updatedTaskList));
            dispatch({ type: 'update', value: updatedTaskList })
        }

        function toggleLight() {
            let light = localStorage.getItem('light');
            let btnImage = document.querySelector('.light-btn');
            light === 'light' ? btnImage.src = toggleOff : btnImage.src = toggleOn;
            btnImage === toggleOn ? btnImage = toggleOff : btnImage = toggleOn;
            light === 'light' ? backgroundGradFx(1, 18) : backgroundGradFx(17, 0);
            light === 'light' ? light = 'dark' : light = 'light';
            localStorage.setItem('light', light);
        }

        return (
            <Component
                {...props}
                getTitle={title}
                setTitle={e => dispatch({
                    type: 'field',
                    field: 'title',
                    value: e.currentTarget.value
                })}
                getDescription={description}
                setDescription={e => dispatch({
                    type: 'field',
                    field: 'description',
                    value: e.currentTarget.value
                })}
                getDeveloper={developer}
                setDeveloper={e => dispatch({
                    type: 'field',
                    field: 'developer',
                    value: e.currentTarget.value
                })}
                getDifficulty={difficulty}
                setDifficulty={e => dispatch({
                    type: 'field',
                    field: 'difficulty',
                    value: e.currentTarget.value
                })}
                getStatus={status}
                sorted={sorted}
                sortByComplexity={() => sortList()}
                storeTask={() => createTask()}
                getTask={() => readFromStorage()}
                getStore={store}
                getSortedStore={sortedList}
                update={updateTask}
                deleteAll={() => cleanStorage()}
                showTrashBin={() => dispatch({ type: 'showTrash' })}
                hideTrashBin={() => dispatch({ type: 'hideTrash' })}
                trash={showTrash}
                referenceDev={currentDevField}
                referenceDesc={currentDescField}
                lights={() => toggleLight()}
                error={error} />
        )
    }
    return GetFormData;
}