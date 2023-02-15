import React, { useState } from 'react';
import "./ModaleSpy.css"

export default function ModaleSpy({ setModale, setData }) {

    const [spyData, setSpyData] = useState({});

    function handleChange(e) {
        setSpyData({ ...spyData, [e.target.id]: e.target.value })
        console.log({ ...spyData, [e.target.id]: e.target.value })
    }

    function saveSpy(e) {
        e.preventDefault();
        setData(spyData)
        setModale(false);
    }

    function quit() {
        setModale(false)
    }

    return (
        <div className="ModaleSpy_wrap">
            <div className="ModaleSpy_box">
                <p className='ModaleSpy_titre'>Enregistrer un spy</p>
                <p className='ModaleSpy_quit' onClick={quit}>X</p>

                <form className="ModaleSpy_form">
                    {/* <label for="impact">Heure impact</label> */}
                    <input
                        type="text"
                        id="impact"
                        value={spyData.impact}
                        onChange={e => handleChange(e)}
                        placeholder="Heure de l'impact">
                    </input>

                    {/* <label for="comment">Commentaire</label> */}
                    <input
                        type="text"
                        id="comment"
                        value={spyData.comment}
                        onChange={e => handleChange(e)}
                        placeholder="Commentaire">
                    </input>

                    <button
                        className='btn green'
                        onClick={(e) => saveSpy(e)}
                    >Enregistrer</button>
                </form>
            </div>
        </div>
    )
}
