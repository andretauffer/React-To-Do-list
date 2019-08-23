import React, { useReducer, useRef } from 'react'
import HOC from './HOC.js'
import './index.css';
import trashWhite from './images/trashwhite.png'
import trashBlack from './images/trashblack.png'
import edit from './images/edit.png'
import toggleOff from './images/switch (1).svg'

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
                {console.log(props.sorted)}
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
                <label htmlFor="developer-input">
                    <p>Developer</p>
                    <input
                        className="developer-input"
                        type="text"
                        value={props.getDeveloper}
                        onChange={props.setDeveloper} />
                </label>
                <label htmlFor="difficulty-input">
                    <p>Complexity</p>
                    <input className="difficulty-input"
                        type="number"
                        min="0" max="10" step="1"
                        onkeydown="return false"
                        value={props.difficulty}
                        onChange={props.setDifficulty} />
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
                    <button id="sort-btn" type="button" value="send" onClick={props.sortByComplexity}>Sort by Complexity</button>
                    <img src={toggleOff} alt="lights button" className="light-btn" type="button" value="send" onClick={props.lights} />
                </div>
            </form>
        </div>
    </div>

const Tasks = (props) => {
    return (
        <div className={"column toggle-light"}>
            {console.log('sorted in tasks', props.sorted)}
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
                                    <img src={edit} alt='edit' className="edit btn" onClick={(e) => props.updateTask(e, { type: 'clearDevField' })} />
                                </div>
                                : <input
                                    className="developer-input"
                                    type="text"
                                    ref={props.referenceDev}
                                    placeholder="Developer"></input>}
                            {el.description ?
                                <div className="developer-field-btn">
                                    <div className="task-description">Description: {el.description}</div>
                                    <img src={edit} alt='edit' className="edit btn" onClick={(e) => props.updateTask(e, { type: 'clearDescField' })} />
                                </div>
                                : <textarea
                                    id="desc"
                                    rows="5"
                                    className="description-input"
                                    ref={props.referenceDesc} />}

                            <div className="task-status"> {el.status}</div>
                            <div className="task-difficulty">Complexity: {el.difficulty}</div>
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
            })}
        </div>
    )
}

const EnhancedApp = HOC(App);

export default EnhancedApp