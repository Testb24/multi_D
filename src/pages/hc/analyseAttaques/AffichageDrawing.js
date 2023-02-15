import React from 'react';
import './AffichageDrawing.css';
import { saveMur, saveSynchro, saveSpy } from './functionsAffichage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBinoculars, faShield, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
// import { faInstagram, faPinterestP, faFacebookF } from '@fortawesome/free-brands-svg-icons';
// import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'


export default function AffichageDrawing(props) {

    let data = props.data
    // console.log(data)
    // console.log(props)

    if (data) {
        data.sort((a, b) => a.def.X - b.def.X)
        data.sort((a, b) => a.def.Y - b.def.Y)
        // attaques.sort((a, b) => a.cible - b.cible)
    }
    // console.log(data)

    // let attaquesByTown = []

    // if (data)
    //     while (data.length > 0) {
    //         // console.log(attaques)
    //         let cible = attaques[0].def;
    //         let i = 0;
    //         if (attaques.length > 1) {
    //             while (attaques[i].def == cible) {
    //                 // console.log(attaques[i].cible + ' ' + cible)
    //                 i++
    //             }
    //             attaquesByTown.push(attaques.slice(0, i));
    //             attaques = attaques.slice(i, attaques.length);
    //             // console.log(attaques)
    //             // break;
    //         } else {
    //             attaquesByTown.push(attaques);
    //             // console.log("out")
    //             attaques = [];
    //             // break;
    //         }
    //     }

    // console.log(attaquesByTown)
    const char = 'Environment &amp; Forest';

    function addMur(village) {
        // console.log(attaque)
        saveMur(village)
    }

    function addSynchro(attaque, index) {
        // console.log(attaque)
        // console.log(index)
        saveSynchro(attaque, index)
    }

    function addSpy(attaque) {
        saveSpy(attaque)
    }

    return (
        <div className='draw_main'>

            {data && data.length > 0 && data.map((village, index1) => {
                return (
                    <div key={index1} className="block">
                        <a href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + village.def.X + "&y=" + village.def.Y}
                            target="_blank"
                            className='link_coo_draw_zone'
                        >
                            {village.def.X + '/' + village.def.Y}
                        </a>

                        <div className='village_block'>
                            {village.attaques.map((attaque, index2) => {
                                // console.log(attaque)
                                return (

                                    <div key={index2}>

                                        {/* BOUTTON SPY */}
                                        <div
                                            className='draw_circle_def_spy_icc_block'
                                            onClick={() => addSpy(attaque)}
                                        >
                                            <FontAwesomeIcon icon={faBinoculars}
                                                className={true === true ? 'draw_circle_def_spy_icc' : 'draw_circle_def_spy_icc_ok'}
                                            ></FontAwesomeIcon>
                                            {true === true ?
                                                <p className='draw_circle_def_spy_info'>cliquer pour demander un spy</p>
                                                :
                                                <p className='draw_circle_def_spy_info'>spy déjà demandé</p>
                                            }
                                        </div>
                                        {/* {<div onClick={() => addSpy(attaque)} className='draw_circle draw_circle_def_spy'>
                                            <p className='draw_circle_def_spy_info'>cliquer pour demander un spy</p>
                                        </div>} */}

                                        {/* <FontAwesomeIcon icon={faShield} className={'draw_circle_def_spy_icc'} />
                                        <FontAwesomeIcon icon={faShieldHalved} className={'draw_circle_def_spy_icc'} /> */}

                                        {attaque.detail.vague && attaque.detail.vague.length > 0 && attaque.detail.vague.map((seconde, index) => {
                                            return (
                                                <div className='draw2' key={index}>

                                                    {/* HEURE */}
                                                    <div
                                                        style={{
                                                            margin: '0px 10%',
                                                            // position: 'absolute',
                                                            // top: '-25px',
                                                            // left: '0px',
                                                            zIndex: '+1',
                                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                            // backgroundColor: 'red',
                                                            width: "80%",
                                                            height: '22px',
                                                            // margin: 'auto',
                                                            textAlign: 'center',
                                                            fontWeight: '700'
                                                        }}>
                                                        {
                                                            // index2 == 0 && 
                                                            <p style={{ padding: '0', margin: '0' }}>{
                                                                ((new Date(attaque.time.impact + index * 1000)).getHours() < 10 ? '0' : '') +
                                                                (new Date(attaque.time.impact + index * 1000)).getHours() + ':' +
                                                                ((new Date(attaque.time.impact + index * 1000)).getMinutes() < 10 ? '0' : '') +
                                                                (new Date(attaque.time.impact + index * 1000)).getMinutes() + ':' +
                                                                ((new Date(attaque.time.impact + index * 1000)).getSeconds() < 10 ? '0' : '') +
                                                                (new Date(attaque.time.impact + index * 1000)).getSeconds()
                                                            }</p>
                                                        }
                                                    </div>

                                                    {/* BARRE verticale*/}
                                                    <div style={{ height: '0px' }}>
                                                        <div style={{
                                                            height:
                                                                ((seconde - 1) * (25) + 30 + 25 + 25) + (index == 0 ? 60 : 0) +
                                                                (index + 1 < attaque.detail.vague.length ? 45 : -15) + -5 +
                                                                'px',
                                                            width: '2px',
                                                            backgroundColor: 'black',
                                                            margin: '8px auto'
                                                        }}
                                                        >
                                                        </div>
                                                    </div>

                                                    {/* BARRE horizontale */}
                                                    <div style={{ height: '0px', position: 'relative' }}>
                                                        <div
                                                            style={{
                                                                height: index == 0 ? '4px' : '4px',
                                                                width: '60px',
                                                                backgroundColor: 'black',
                                                                margin: '1px auto',
                                                                position: 'relative',
                                                                top: index == 0 ? '49px' : '15px',
                                                                zIndex: '-1 '
                                                            }}
                                                        >
                                                        </div>


                                                    </div>

                                                    {/* BOUTTON MUR */}
                                                    {index == 0 && <div
                                                        className='draw_circle_def_mur_icc_block'
                                                        onClick={() => addMur(village)}
                                                    >
                                                        <FontAwesomeIcon icon={faShield}
                                                            className={true === true ? 'draw_circle_def_mur_icc' : 'draw_circle_def_mur_icc_ok'}
                                                        ></FontAwesomeIcon>
                                                        {true === true ?
                                                            <p className='draw_circle_def_mur_info'>cliquer pour ajouter un mur</p>
                                                            :
                                                            <p className='draw_circle_def_mur_info'>mur déjà demandé</p>
                                                        }
                                                    </div>}

                                                    {/* {index == 0 && <div onClick={() => addMur(village)} className='draw_circle draw_circle_def_mur'>
                                                        <p className='draw_circle_def_mur_info'>cliquer pour ajouter un mur</p>
                                                    </div>} */}

                                                    <div className='draw_circle draw_circle_main'>
                                                        <p className='draw_vague_txt'>{seconde}</p>
                                                    </div>
                                                    {
                                                        seconde > 1 && Array.from(Array(seconde - 1)).map((vague, index3) => {
                                                            return (
                                                                <div key={index3} className='draw_circle draw_circle_second'></div>
                                                            )
                                                        })
                                                    }

                                                    {/* BOUTTON SYNCHRO */}
                                                    {<div
                                                        className='draw_circle_def_synchro_icc_block'
                                                        onClick={() => addSynchro(attaque, index)}
                                                    >
                                                        <FontAwesomeIcon icon={faShieldHalved}
                                                            className={true === true ? 'draw_circle_def_synchro_icc' : 'draw_circle_def_synchro_icc_ok'}
                                                        ></FontAwesomeIcon>
                                                        {true === true ?
                                                            <p className='draw_circle_def_synchro_info'>cliquer pour ajouter une synchro</p>
                                                            :
                                                            <p className='draw_circle_def_synchro_info'>synchro déjà demandée</p>
                                                        }
                                                    </div>}

                                                    {/* <div onClick={() => addSynchro(attaque, index)} className='draw_circle draw_circle_def_synchro'>
                                                        <p className='draw_circle_def_synchro_info'>cliquer pour ajouter une synchro</p>
                                                    </div> */}
                                                </div>
                                            )
                                        })}

                                        {attaque.detail.vague && attaque.detail.vague === 1 &&
                                            <div className='draw2'>

                                                {/* HEURE */}
                                                <div
                                                    style={{
                                                        margin: '0px 10%',
                                                        // position: 'absolute',
                                                        // top: '-25px',
                                                        // left: '0px',
                                                        zIndex: '+1',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                        // backgroundColor: 'red',
                                                        width: "80%",
                                                        height: '22px',
                                                        // margin: 'auto',
                                                        textAlign: 'center',
                                                        fontWeight: '700'
                                                    }}>
                                                    {
                                                        // index2 == 0 && 
                                                        <p style={{ padding: '0', margin: '0' }}>{
                                                            ((new Date(attaque.time.impact)).getHours() < 10 ? '0' : '') +
                                                            (new Date(attaque.time.impact)).getHours() + ':' +
                                                            ((new Date(attaque.time.impact)).getMinutes() < 10 ? '0' : '') +
                                                            (new Date(attaque.time.impact)).getMinutes() + ':' +
                                                            ((new Date(attaque.time.impact)).getSeconds() < 10 ? '0' : '') +
                                                            (new Date(attaque.time.impact)).getSeconds()
                                                        }</p>
                                                    }
                                                </div>

                                                {/* BARRE verticale*/}
                                                <div style={{ height: '0px' }}>
                                                    <div style={{
                                                        height: '100px',
                                                        width: '2px',
                                                        backgroundColor: 'black',
                                                        margin: '8px auto'
                                                    }}
                                                    >
                                                    </div>
                                                </div>

                                                {/* BARRE horizontale */}
                                                <div style={{ height: '0px', position: 'relative' }}>
                                                    <div
                                                        style={{
                                                            height: '4px',
                                                            width: '60px',
                                                            backgroundColor: 'black',
                                                            margin: '1px auto',
                                                            position: 'relative',
                                                            top: '49px',
                                                            zIndex: '-1 '
                                                        }}
                                                    >
                                                    </div>


                                                </div>


                                                {/* BOUTTON MUR */}
                                                {<div
                                                    className='draw_circle_def_mur_icc_block'
                                                    onClick={() => addMur(village)}
                                                >
                                                    <FontAwesomeIcon icon={faShield}
                                                        className={true === true ? 'draw_circle_def_mur_icc' : 'draw_circle_def_mur_icc_ok'}
                                                    ></FontAwesomeIcon>
                                                    {true === true ?
                                                        <p className='draw_circle_def_mur_info'>cliquer pour ajouter un mur</p>
                                                        :
                                                        <p className='draw_circle_def_mur_info'>mur déjà demandé</p>
                                                    }
                                                </div>}

                                                {/* {<div onClick={() => addMur(village)} className='draw_circle draw_circle_def_mur'>
                                                    <p className='draw_circle_def_mur_info'>cliquer pour ajouter un mur</p>
                                                </div>} */}

                                                <div className='draw_circle draw_circle_main'>
                                                    <p className='draw_vague_txt'>{1}</p>
                                                </div>

                                                {/* BOUTTON SYNCHRO */}
                                                {<div
                                                    className='draw_circle_def_synchro_icc_block'
                                                    onClick={() => addSynchro(attaque, 0)}
                                                >
                                                    <FontAwesomeIcon icon={faShieldHalved}
                                                        className={true === true ? 'draw_circle_def_synchro_icc' : 'draw_circle_def_synchro_icc_ok'}
                                                    ></FontAwesomeIcon>
                                                    {true === true ?
                                                        <p className='draw_circle_def_synchro_info'>cliquer pour ajouter une synchro</p>
                                                        :
                                                        <p className='draw_circle_def_synchro_info'>synchro déjà demandée</p>
                                                    }
                                                </div>}
                                                {/* <div onClick={() => addSynchro(attaque, 0)} className='draw_circle draw_circle_def_synchro'>
                                                    <p className='draw_circle_def_synchro_info'>cliquer pour ajouter une synchro</p>
                                                </div> */}
                                                <div />
                                            </div>
                                        }


                                    </div>


                                )
                            })
                            }

                        </div>

                    </div>)
            })}

        </div>
    )
}
