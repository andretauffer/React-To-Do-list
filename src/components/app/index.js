import React, { useReducer } from 'react'
import './index.css';

const App = (props) => {
    return (

        <div>
            <h1>Task Manager</h1>
            <div className="form-trash">
            <FormData />
            {props.trash === 'true' ? <TaskData column={'deleted'}/> : null}
            </div>
            <div className="general-columns">
                <TaskData column={'created'} />
                <TaskData column={'onhold'} />
                <TaskData column={'active'} />
                <TaskData column={'completed'} />
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
                    <button id="submit-btn" type="button" value="send" onClick={props.showTrash}>Show trash!</button>
                </div>
            </form>
        </div>
    </div>

const Created = (props) => {
    return (
        <div className="column">
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
                                    <button className="task-btns" onClick={props.deleteTask}>Delete</button>
                                }
                                {el.status === 'active' ?
                                    <button className="task-btns" onClick={props.completedTask}>Completed</button> :
                                    <button className="task-btns" disabled>Completed</button>
                                }
                                {(el.status === 'onhold' || el.status === 'completed') ?
                                    <button className="task-btns" disabled>On Hold</button> :
                                    <button className="task-btns" onClick={props.onholdTask}>On Hold</button>
                                }
                                <button className="task-btns" onClick={props.update}>Update</button>
                                {(!el.developer || el.status === 'active' || el.status === 'completed' || el.status === 'deleted') ?
                                    <button className="task-btns" disabled>Active</button> :
                                    <button className="task-btns" onClick={props.activeTask}>Active</button>
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
    store: [],
    showTrash: 'false',
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
                store: state,
            }
        case 'error':
            return {
                ...state,
                error: 'You should have a title for the task'
            }
        case 'showTrash':
            return {
                ...state,
                showTrash: 'true'
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
                localStorage.setItem('list', JSON.stringify(tasklist));
            } else {
                dispatch({ type: 'error' });
            }
            window.location.reload();
        }

        const cleanStorage = () => {
            localStorage.removeItem('list');
            window.location.reload();
        }

        const updateTask = (e, action) => {
            const elementId = Number(e.currentTarget.parentElement.parentElement.id);
            const updatedTaskList = tasklist.map(el => {
                if (el.id === elementId) {
                    switch (action.type) {
                        case 'update':
                            return el = { title: el.title, developer, description, status: el.status, id: el.id };
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
            window.location.reload();
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
                deleteTask={(e) => updateTask(e, { type: 'delete' })}
                onholdTask={(e) => updateTask(e, { type: 'onhold' })}
                completedTask={(e) => updateTask(e, { type: 'completed' })}
                activeTask={(e) => updateTask(e, { type: 'active' })}
                deleteAll={() => cleanStorage()}
                showTrash={() => dispatch({ type: 'showTrash'})}
                trash={showTrash}
                update={(e) => updateTask(e, { type: 'update' })}
                error={error} />
        )
    }
    return GetFormData;
}


const FormData = HOC(Form);
const TaskData = HOC(Created);
const EnhancedApp = HOC(App);

export default EnhancedApp