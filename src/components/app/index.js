import React, { useState, useEffect } from 'react'

const App = () =>
    <div>
        <h1>Task Manager</h1>
        <FormData />
        <TaskData />
    </div>

const Form = (props) =>
    <div>
        <div className="input-page toggle-light">
            <form className="input-form" value="x">
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
                        id="developer" 
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
                    <button id="submit-btn" type="button" value="send">Create</button>
                </div>
                <img id="preview" src="" alt="Image preview..." hidden />
            </form>
        </div>
    </div>

const Task = (props) => 
    <div>
        <p>{props.getTitle}</p>
        <p>{props.getDeveloper}</p>
        <p>{props.getDescription}</p>
    </div>


const GetFormDataHOC = (Component) => {
    const GetFormData = () => {
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [developer, setDeveloper] = useState('');

        const storage = () => {
            const previousStorage = localStorage.getItem('list');
            const list = [{title, developer, description}]
        }

        useEffect(() => {
            console.log(title);
            console.log(description);
            console.log(developer);

        }, [title, description, developer])
        return <Component
            getTitle={title}
            setTitle={e => setTitle(e.currentTarget.value)}
            getDescription={description}
            setDescription={e => setDescription(e.currentTarget.value)}
            getDeveloper={developer}
            setDeveloper={e => setDeveloper(e.currentTarget.value)} />;
    }
    return GetFormData;
}

const FormData = GetFormDataHOC(Form);
const TaskData = GetFormDataHOC(Task);

export default App