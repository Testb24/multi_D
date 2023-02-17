import React from 'react'

export default function AffichageTable(props) {

    console.log(props.data)

    return (
        <div>
            {<table className='centered'>
                <thead>
                    <tr>
                        <th>Vivi attaquant</th>
                        <th>Vivi cible</th>
                        <th>Impact</th>
                        <th>Trajet</th>
                        <th>Vagues</th>
                        <th>Troupes</th>
                    </tr>
                </thead>

                <tbody>
                    {props.data && props.data.length > 0 && props.data.map((vivi) => {
                        if (vivi.attaques && vivi.attaques.length > 0) {
                            return (
                                vivi.attaques.map(
                                    (attaque, index2) => {
                                        // console.log(attaque)
                                        return (
                                            <tr key={index2}>
                                                <td>{attaque.off.X + "/" + attaque.off.Y}</td>
                                                <td>{attaque.def.X + "/" + attaque.def.Y}</td>
                                                {/* <td>{attaque.time.impact}</td> */}
                                                <td>{(new Date(attaque.time.impact)).toLocaleString()}</td>
                                                <td>{attaque.time.path}</td>
                                                <td>{attaque.detail.vague}</td>
                                                <td>{attaque.detail.troupes}</td>
                                            </tr>
                                        )
                                    })
                            )
                        }
                    })}
                </tbody>

            </table>}


        </div>
    )
}
