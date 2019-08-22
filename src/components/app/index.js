import React, { useReducer, useRef } from 'react'
import './index.css';
import trashWhite from './images/trashwhite.png'
import trashBlack from './images/trashblack.png'
import edit from './images/edit.png'
import toggleOn from './images/switch.svg'
import toggleOff from './images/switch (1).svg'
import backgroundGradFx from './toggleLight'

const App = (props) => {
    return (

        <div>
            <h1>Task Manager</h1>
            <div className="form-trash">
                <Form {...props} />
                {props.trash ?
                    <div>
                        <Tasks {...props} column={'deleted'} updateTask={props.update} />
                        <img src={trashWhite} alt="trashBin" className="trash-btn white" type="button" value="send" onClick={props.hideTrashBin} />
                    </div>
                    : <img src={trashBlack} alt="trashBin" className="trash-btn black" type="button" value="send" onClick={props.showTrashBin} />}
            </div>
            <div className="general-columns">
                <Tasks {...props} column={'created'} updateTask={props.update} />
                <Tasks {...props} column={'on-hold'} updateTask={props.update} />
                <Tasks {...props} column={'active'} updateTask={props.update} />
                <Tasks {...props} column={'completed'} updateTask={props.update} />
            </div>
        </div>
    )
}

const Form = (props) =>

    <div>
        <div>
            <form className="input-form toggle-light" value="x">
                {<p className='error'>{props.error}</p>}
                <label htmlFor="title">
                    <p>Title</p>
                    <input
                        id="title"
                        type="text"
                        value={props.getTitle}
                        onChange={props.setTitle}
                        required />
                </label>
                <label htmlFor="developer">
                    <p>Developer</p>
                    <input
                        className="developer-input"
                        type="text"
                        value={props.getDeveloper}
                        onChange={props.setDeveloper} />
                </label>
                <p>Description</p>
                <textarea
                    id="desc"
                    rows="5"
                    className="description-input"
                    value={props.getDescription}
                    onChange={props.setDescription} />
                <div className="buttons-container">
                    <button id="submit-btn" type="button" value="send" onClick={props.storeTask}>Create</button>
                    <button id="submit-btn" type="button" value="send" onClick={props.deleteAll}>Delete everything!</button>
                    <img src={toggleOff} alt="lights button" className="light-btn" type="button" value="send" onClick={props.lights}/>
                </div>
            </form>
        </div>
    </div>

const Tasks = (props) => {
    return (
        <div className={"column " + props.column + " toggle-light"}>
            {props.getStore.find(el => el.status === props.column) ? <h4 className="column-titles"> {props.column.toUpperCase()} </h4>
             : <div className="no-tasks">No {props.column} tasks at the moment</div>}
            {props.getStore.map(el => {
                if (el.status === props.column) {
                    return (
                        <div className={"task " + props.column} id={el.id}>
                            <div className="task-title">Title: {el.title}</div>
                            {el.developer ?
                                <div className="developer-field-btn">
                                    <div className="task-developer"> Developer: {el.developer}</div>
                                    <img src={edit} alt='edit' className="edit btn" onClick={(e) => props.updateTask(e, { type: 'clearDevField' })}/>
                                </div>
                                : <input
                                    className="developer-input"
                                    type="text"
                                    ref={props.referenceDev}
                                    placeholder="Developer"></input>}
                            {el.description ?
                                <div className="developer-field-btn">
                                    <div className="task-description">Description: {el.description}</div>
                                    <img src={edit} alt='edit' className="edit btn" onClick={(e) => props.updateTask(e, { type: 'clearDescField' })}/>
                                </div>
                                : <textarea
                                    id="desc"
                                    rows="5"
                                    className="description-input"
                                    ref={props.referenceDesc} />}

                            <div className="task-status"> {el.status}</div>
                            <div className="btns-container">
                                {(el.status === 'deleted' || el.status === 'completed') ?
                                    <button className="task-btns" disabled>Delete</button> :
                                    <button className="task-btns" onClick={(e) => props.updateTask(e, { type: 'delete' })}>Delete</button>
                                }
                                {el.status === 'active' ?
                                    <button className="task-btns" onClick={(e) => props.updateTask(e, { type: 'completed' })}>Completed</button> :
                                    <button className="task-btns" disabled>Completed</button>
                                }
                                {(el.status === 'on-hold' || el.status === 'completed') ?
                                    <button className="task-btns" disabled>On Hold</button> :
                                    <button className="task-btns" onClick={(e) => props.updateTask(e, { type: 'on-hold' })}>On Hold</button>
                                }
                                <button className="task-btns" onClick={(e) => props.update(e, { type: 'update' })}>Update</button>
                                {(!el.developer || el.status === 'active' || el.status === 'completed' || el.status === 'deleted') ?
                                    <button className="task-btns" disabled>Active</button> :
                                    <button className="task-btns" onClick={(e) => props.updateTask(e, { type: 'active' })}>Active</button>
                                }
                            </div>
                        </div>
                    )
                }
            }) }
        </div>
    )
}

const initialState = {
    title: '',
    description: '',
    developer: '',
    status: '',
    error: '',
    showTrash: false,
    store: '',
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
            }
        case 'update':
            return {
                ...state,
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

const HOC = Component => {
    const GetFormData = (props) => {
        const [state, dispatch] = useReducer(HOCreducer, initialState);
        const { title, developer, description, error, status, showTrash } = state;
        const currentDevField = useRef(null);
        const currentDescField = useRef(null);
        const readFromStorage = () => {
            let list = localStorage.getItem('list');
            list !== null ? list = JSON.parse(list) : list = [];
            return list;
        }
        const tasklist = readFromStorage();

        const createTask = () => {
            let id = Math.round(Math.random() * 1000);
            if (title !== '') {
                dispatch({ type: 'created' });
                tasklist.push({
                    title: title,
                    developer: developer,
                    description: description,
                    status: 'created',
                    id
                });
                localStorage.setItem('list', JSON.stringify(tasklist));
            } else {
                dispatch({ type: 'error' });
            }
        }

        const cleanStorage = () => {
            localStorage.removeItem('list');
            dispatch({ type: 'update', value: [] })
        }

        const updateTask = (e, action) => {
            const elementId = Number(e.currentTarget.parentElement.parentElement.id);
            const updatedTaskList = tasklist.map(el => {
                if (el.id === elementId) {
                    switch (action.type) {
                        case 'update':
                            let actualDev = '';
                            let actualDesc = '';
                            currentDevField.current ? actualDev = currentDevField.current.value : actualDev = el.developer;
                            currentDescField.current ? actualDesc = currentDescField.current.value : actualDesc = el.description;
                            return el = { title: el.title, developer: actualDev, description: actualDesc, status: el.status, id: el.id };
                        case 'delete':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'deleted', id: el.id };
                        case 'clearDevField':
                            return el = { title: el.title, developer: '', description: el.description, status: el.status, id: el.id };
                        case 'clearDescField':
                            return el = { title: el.title, developer: el.developer, description: '', status: el.status, id: el.id };
                        case 'on-hold':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'on-hold', id: el.id };
                        case 'completed':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'completed', id: el.id };
                        case 'active':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'active', id: el.id };
                        default:
                            break;
                    }
                }
                return el
            })
            localStorage.setItem('list', JSON.stringify(updatedTaskList));
            dispatch({ type: 'update', value: tasklist })
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
                getStatus={status}
                storeTask={() => createTask()}
                getTask={() => readFromStorage()}
                getStore={tasklist}
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

const EnhancedApp = HOC(App);

export default EnhancedApp