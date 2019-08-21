import React, { useReducer } from 'react'
import './index.css';

const App = (props) => {
    return (

        <div>
            <h1>Task Manager</h1>
            <FormData />
            <TaskData />
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

                    <p>{props.getTitle}</p>

                    <button id="submit-btn" type="button" value="send" onClick={props.storeTask}>Create</button>
                    {/* <button id="submit-btn" type="button" value="send" onClick={props.getStuff}>Do other stuff</button> */}
                    <button id="submit-btn" type="button" value="send" onClick={props.deleteAll}>Delete everything!</button>
                </div>
            </form>
        </div>
    </div>

const Created = (props) =>
    <div className="column created">
        {props.getStore ? props.getStore.map(el => {
            return (
                <div className="task created" id={el.id}>
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
                        <button className="task-btns" onClick={props.deleteTask}>Delete</button>
                        <button className="task-btns">Completed</button>
                        <button className="task-btns">On Hold</button>
                        <button className="task-btns" onClick={props.update}>Update</button>
                    </div>
                </div>
            )
        }) : <div>No tasks at the moment</div>}
        )
    </div>



const initialState = {
    title: '',
    description: '',
    developer: '',
    status: '',
    error: '',
    store: [],
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
        case 'active':
            return {
                ...state,
                status: 'active'
            }
        case 'completed':
            return {
                ...state,
                status: 'completed'
            }
        case 'onhold':
            return {
                ...state,
                status: 'onhold'
            }
        case 'deleted':
            return {
                ...state,
                status: 'deleted'
            }
        case 'error':
            return {
                ...state,
                error: 'You should have a title for the task'
            }

        default:
            break;
    }
}

const HOC = Component => {
    const GetFormData = (props) => {
        const [state, dispatch] = useReducer(HOCreducer, initialState);
        const { title, developer, description, error, status } = state;
        const readFromStorage = () => {
            let list = localStorage.getItem('list');
            list !== null ? list = JSON.parse(list) : list = [];
            return list;
        }
        const tasklist = readFromStorage();
        
        const createTask = () => {
            let id = Math.round(Math.random()*1000);
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
        
        const updateTask = (e) => {
            const elementId = Number(e.currentTarget.parentElement.parentElement.id);
            const updatedTaskList = tasklist.map(el => {
                if(el.id === elementId) {
                    return el = {title: el.title, developer, description, status: status, id: el.id };
                }
                return el
            })
            localStorage.setItem('list', JSON.stringify(updatedTaskList));
            window.location.reload();
        }

        const deleteTask = (e) => {
            const elementId = Number(e.currentTarget.parentElement.parentElement.id);
            let updatedTaskList = []; 
            tasklist.map(el => {
                if(el.id === elementId) {
                    return el = null;
                }
                return updatedTaskList.push(el); 
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
                deleteTask={(e) => deleteTask(e)}
                deleteAll={() => cleanStorage()}
                update={(e) => updateTask(e)}
                error={error} />
        )
    }
    return GetFormData;
}


const FormData = HOC(Form);
const TaskData = HOC(Created);

export default App