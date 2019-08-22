import React, { useReducer, useEffect } from 'react'
import './index.css';

const App = (props) => {
    return (

        <div>
            <h1>Task Manager</h1>
            <div className="form-trash">
                <FormData />
                {props.trash ?
                    <div>
                        <TaskData column={'deleted'} updateTask={props.update} />
                        <button id="submit-btn" type="button" value="send" onClick={props.hideTrashBin}>Hide trash!</button>
                    </div>
                    : <button id="submit-btn" type="button" value="send" onClick={props.showTrashBin}>Show trash!</button>}
            </div>
            <div className="general-columns">
                <TaskData column={'created'} updateTask={props.update} {...props} />
                <TaskData column={'onhold'} updateTask={props.update} />
                <TaskData column={'active'} updateTask={props.update} />
                <TaskData column={'completed'} updateTask={props.update} />
            </div>
        </div>
    )
}

const Form = (props) =>

    <div>
        <div>
            <form className="input-form" value="x">
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
                    className="description"
                    value={props.getDescription}
                    onChange={props.setDescription} />
                <div className="buttons-container">
                    <button id="submit-btn" type="button" value="send" onClick={props.storeTask}>Create</button>
                    <button id="submit-btn" type="button" value="send" onClick={props.deleteAll}>Delete everything!</button>
                </div>
            </form>
        </div>
    </div>

const Tasks = (props) => {
    console.log(props)
    return (
        <div className={"column " + props.column}>
            {props.getStore ? props.getStore.map(el => {
                if (el.status === props.column) {
                    return (
                        <div className={"task " + props.column} id={el.id}>
                            <div className="task-title">Title: {el.title}</div>
                            {el.developer ? <div className="task-developer"> Developer: {el.developer}</div>
                                : <input
                                    className="developer-input"
                                    type="text"
                                    value={props.getDeveloper}
                                    onChange={props.setDeveloper}
                                    // onChange={props.setDeveloper}
                                    placeholder="Developer"></input>}
                            {el.description ? <div className="task-description">Description: {el.description}</div> : <textarea
                                id="desc"
                                rows="5"
                                className="description"
                                value={props.getDescription}
                                onChange={props.setDescription} />}
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
                                {(el.status === 'onhold' || el.status === 'completed') ?
                                    <button className="task-btns" disabled>On Hold</button> :
                                    <button className="task-btns" onClick={(e) => props.updateTask(e, { type: 'onhold' })}>On Hold</button>
                                }
                                <button className="task-btns" onClick={(e) => props.updateTask(e, { type: 'update' })}>Update</button>
                                {(!el.developer || el.status === 'active' || el.status === 'completed' || el.status === 'deleted') ?
                                    <button className="task-btns" disabled>Active</button> :
                                    <button className="task-btns" onClick={(e) => props.updateTask(e, { type: 'active' })}>Active</button>
                                }
                            </div>
                        </div>
                    )
                }
            }) : <div>No tasks at the moment</div>}
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
                dispatch({ type: 'update', value: tasklist })
                localStorage.setItem('list', JSON.stringify(tasklist));
            } else {
                dispatch({ type: 'error' });
            }
        }

        const cleanStorage = () => {
            localStorage.removeItem('list');
        }

        const updateTask = (e, action) => {
            console.log('dev e desc', developer, description)
            const elementId = Number(e.currentTarget.parentElement.parentElement.id);
            const updatedTaskList = tasklist.map(el => {
                if (el.id === elementId) {
                    switch (action.type) {
                        case 'update':
                            console.log('dev e desc', developer, description)
                            return el = { title: el.title, developer: developer, description: description, status: el.status, id: el.id };
                        case 'delete':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'deleted', id: el.id };
                        case 'onhold':
                            return el = { title: el.title, developer: el.developer, description: el.description, status: 'onhold', id: el.id };
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
                error={error} />
        )
    }
    return GetFormData;
}


const FormData = HOC(Form);
const TaskData = HOC(Tasks);
const EnhancedApp = HOC(App);

export default EnhancedApp