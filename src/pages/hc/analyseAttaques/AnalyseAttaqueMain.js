import React, { useState, useEffect } from 'react'
import AffichageTable from './AffichageTable'
import AffichageDrawing from './AffichageDrawing'
import { getAll, buildTownData } from './functionsAffichage'

export default function AnalyseAttaqueMain() {
    const [affichage, setAffichage] = useState(false)

    // const { attaques, spys, synchros, murs, infos } = await getAll();

    const [data, setData] = useState({})

    async function getDataAll() {
        // const t = await getAll();
        // setData(t)
        const dataByTown = await buildTownData();
        setData(dataByTown)
        // console.log(dataByTown)
    }

    useEffect(() => {
        getDataAll();
    }, []);

    // useEffect(() => {
    //     console.log(data)
    // }, [data, affichage]);

    return (
        <div>
            <button 
            className='btn blue accent-3'
            onClick={() => setAffichage(!affichage)}>Affichage</button>

            {affichage && data !== {} && < AffichageTable
                data={data}
            />}

            {!affichage && data !== {} && data.length > 0 && <AffichageDrawing
                data={data}
            />}
        </div>
    )
}