import React, { useEffect, useState } from 'react';
import { CRUD_getAll, cleanIntervalle } from './AnalyseProfil_functions.js'
import M from 'materialize-css';
import "./AnalyseProfil.css";
import img_stuff from "../../../assets/stuff.png";
import img_clock from "../../../assets/clock.png";
import img_attack from "../../../assets/attack1.png";
import img_defence from "../../../assets/defence1.png";
import img_attack1 from "../../../assets/attackGold1.png";
import img_defence1 from "../../../assets/defenceGold1.png";
import img_xp from "../../../assets/xpGold.png";


export default function AnalyseProfil() {

  const [str, setStr] = useState('');
  const [attaques, setAttaques] = useState([]);
  // const [cleanTime, setCleanTime] = useState([false, false, false]);

  function handleChange(e) {
    setStr(e.target.value)
  }

  const [trackedAcc, setTrackedAcc] = useState([]);
  const [profil, setProfil] = useState([]);
  const [dlData, setDlData] = useState(false);

  useEffect(() => {
    if (dlData) {
      M.toast({ html: "ok" })
      downloadTrackedData()
      // M.AutoInit();
      // downloadProfil()
    }
  }, [dlData])

  async function downloadTrackedData() {

    let temp = await CRUD_getAll("z");
    let PlayerWatched_Uid = [];
    // console.log(temp)
    temp.forEach(profil => {
      // console.log()
      PlayerWatched_Uid.push(profil.Uid);
    })
    // console.log(PlayerWatched_Uid)
    PlayerWatched_Uid = PlayerWatched_Uid.filter((el, i) => i === PlayerWatched_Uid.findIndex(e => e === el));
    // console.log(PlayerWatched_Uid)

    let PlayerWatched_fullData = [];
    PlayerWatched_Uid.map((Uid, i) => {

      let PlayerData = {
        Uid: Uid,
        Un: temp.find(el => el.Uid === Uid).Un,
        // screen: temp.filter(el => el.Uid === Uid).sort((a, b) => a.time - b.time),
        screen: cleanIntervalle(temp, Uid),
        i: i
      };

      PlayerWatched_fullData.push(PlayerData);
    })
    // console.log(PlayerWatched_fullData);

    setTrackedAcc(PlayerWatched_fullData);
  }

  // document.addEventListener('DOMContentLoaded', function () {
  //   var elems = document.querySelectorAll('.collapsible');
  //   var instances = M.Collapsible.init(elems);
  // });

  function cleanString(str) {

    // let a = "Armure d&#39;\u00e9caille";
    str = str.replaceAll('&#39;', "'");
    str = str.replaceAll('\\u00e9', "é");
    str = str.replaceAll('\\u00c9', "E");
    str = str.replaceAll('\\u00e8', "è");
    // console.log(str)
    // console.log("a", str)
    return str
  }

  useEffect(() => {
    // M.AutoInit();
    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.collapsible');
      var instances = M.Collapsible.init(elems, {});
    });
  }, [dlData, trackedAcc]);

  return (
    <>
      {/* <ul class="collapsible">
    <li>
      <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
      <div class="collapsible-body"><table><tbody><tr>123<th></th></tr></tbody></table></div>
    </li>
    <li>
      <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
      <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
    </li>
    <li>
      <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
      <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
    </li>
  </ul> */}

      <div className='container'>

        <button
          onClick={() => { setDlData(true) }}
          className='btn'>
          {dlData ? "data chargée" : "yep"}
        </button>
      </div>

      <div className="container">

        {/* <div className='collapsible_maison_wrap'>
          <details>
            <summary>I have keys but no doors. I have space but no room. You can enter but can’t leave. What am I?</summary>
            A keyboard.
          </details>
          <details>
            <summary>I have keys but no doors. I have space but no room. You can enter but can’t leave. What am I?</summary>
            A keyboard.
          </details>
        </div> */}

        {trackedAcc && trackedAcc.length > 0 &&
          <div className='collapsible_maison_wrap'>
            {trackedAcc.map((playerOff, index1) => {
              // console.log(playerOff)
              return (
                <details key={index1}>
                  <summary className="" >{playerOff.Un}</summary>
                  <a className='top_link'
                    href={
                      "https://ts1.x1.europe.travian.com/profile/" +
                      playerOff.Uid
                    }
                    target="_blank">
                    {playerOff.Un}
                  </a>
                  <table className='collapsible_maison_table'>

                    <thead>
                      <tr>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "22px",
                              height: "22px",
                              backgroundImage: "url(" + img_clock + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>heure d'enregistrement du profil</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "26px",
                              height: "22px",
                              backgroundImage: "url(" + img_attack + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Points off</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "22px",
                              height: "24px",
                              backgroundImage: "url(" + img_defence + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Points def</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "24px",
                              height: "20px",
                              backgroundImage: "url(" + img_xp + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Xp héros</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Casque</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -26px ", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Armure</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -52px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Bras gauche</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -78px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Bras droit</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -104px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Chaussures</p>
                          </div>
                        </th>

                        <th className='analyseZ_hc_th'>
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -130px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          >
                            <p className='analyzeZ_hc_help'>Monture</p>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    {playerOff.screen.map((c, i) => {

                      return (
                        <tbody key={i}>
                          <tr>
                            <th>{c.time ? new Date(c.time).toLocaleTimeString() : new Date(c.time).toLocaleDateString() !== new Date().toLocaleDateString() ? new Date(c.time).toLocaleTimeString() : "<!>"}</th>
                            <th>{i !== 0 && c.ptOff === playerOff.screen[i - 1].ptOff ? "/" : c.ptOff}</th>
                            <th>{i !== 0 && c.ptDef === playerOff.screen[i - 1].ptDef ? "/" : c.ptDef}</th>
                            <th>{i !== 0 && c.xpZ === playerOff.screen[i - 1].xpZ ? "/" : c.xpZ}</th>
                            <th>{i !== 0 && c.helmet.id === playerOff.screen[i - 1].helmet.id ? "/" : cleanString(c.helmet.description) + "(" + c.helmet.tier + ")"}</th>
                            <th>{i !== 0 && c.body.id === playerOff.screen[i - 1].body.id ? "/" : cleanString(c.body.description) + "(" + c.body.tier + ")"}</th>
                            <th>{i !== 0 && c.leftHand.id === playerOff.screen[i - 1].leftHand.id ? "/" : cleanString(c.leftHand.description) + "(" + c.leftHand.tier + ")"}</th>
                            <th>{i !== 0 && c.rightHand.id === playerOff.screen[i - 1].rightHand.id ? "/" : cleanString(c.rightHand.description) + "(" + c.rightHand.tier + ")"}</th>
                            <th>{i !== 0 && c.shoes.id === playerOff.screen[i - 1].shoes.id ? "/" : cleanString(c.shoes.description) + "(" + c.shoes.tier + ")"}</th>
                            <th>{i !== 0 && c.horse.id === playerOff.screen[i - 1].horse.id ? "/" : cleanString(c.horse.description) + "(" + c.horse.tier + ")"}</th>
                          </tr>
                        </tbody>

                      )

                    })}
                  </table>
                </details>
              )
            })}
          </div>}


        {/* {trackedAcc && trackedAcc.length > 0 &&
          <ul className="collapsible">
            {trackedAcc.map((playerOff, index1) => {
              console.log(playerOff)
              return (
                <li key={index1}>
                  <div className="collapsible-header" >{playerOff.Un}</div>
                  <div className="collapsible-body">

                    <a className='top_link'
                      href={
                        "https://ts1.x1.europe.travian.com/profile/" +
                        playerOff.Uid
                      }
                      target="_blank">
                      {playerOff.Un}
                    </a>

                    <table>

                      <thead>
                        <tr>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "22px",
                                height: "22px",
                                backgroundImage: "url(" + img_clock + ")",
                                backgroundPosition: "-0px 0", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>heure d'enregistrement du profil</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "26px",
                                height: "22px",
                                backgroundImage: "url(" + img_attack + ")",
                                backgroundPosition: "-0px 0", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Points off</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "22px",
                                height: "24px",
                                backgroundImage: "url(" + img_defence + ")",
                                backgroundPosition: "-0px 0", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Points def</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "24px",
                                height: "20px",
                                backgroundImage: "url(" + img_xp + ")",
                                backgroundPosition: "-0px 0", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Xp héros</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                backgroundImage: "url(" + img_stuff + ")",
                                backgroundPosition: "-0px 0", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Casque</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                backgroundImage: "url(" + img_stuff + ")",
                                backgroundPosition: "0 -26px ", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Armure</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                backgroundImage: "url(" + img_stuff + ")",
                                backgroundPosition: "0 -52px", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Bras gauche</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                backgroundImage: "url(" + img_stuff + ")",
                                backgroundPosition: "0 -78px", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Bras droit</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                backgroundImage: "url(" + img_stuff + ")",
                                backgroundPosition: "0 -104px", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Chaussures</p>
                            </div>
                          </th>

                          <th className='analyseZ_hc_th'>
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                backgroundImage: "url(" + img_stuff + ")",
                                backgroundPosition: "0 -130px", //26
                                // border:"1px solid white"
                                margin: "auto"
                              }}
                            >
                              <p className='analyzeZ_hc_help'>Monture</p>
                            </div>
                          </th>
                        </tr>
                      </thead>

                      {playerOff.screen.map((c, i) => {

                        return (
                          <></>
                          // <tbody key={i}>
                          //   <tr>
                          //     <th>{c.time ? new Date(c.time).toLocaleTimeString() : new Date(c.time).toLocaleDateString() !== new Date().toLocaleDateString() ? new Date(c.time).toLocaleTimeString() : "<!>"}</th>
                          //     <th>{i !== 0 && c.ptOff === playerOff.screen[i - 1].ptOff ? "/" : c.ptOff}</th>
                          //     <th>{i !== 0 && c.ptDef === playerOff.screen[i - 1].ptDef ? "/" : c.ptDef}</th>
                          //     <th>{i !== 0 && c.xpZ === playerOff.screen[i - 1].xpZ ? "/" : c.xpZ}</th>
                          //     <th>{i !== 0 && c.helmet.id === playerOff.screen[i - 1].helmet.id ? "/" : cleanString(c.helmet.description) + "(" + c.helmet.tier + ")"}</th>
                          //     <th>{i !== 0 && c.body.id === playerOff.screen[i - 1].body.id ? "/" : cleanString(c.body.description) + "(" + c.body.tier + ")"}</th>
                          //     <th>{i !== 0 && c.leftHand.id === playerOff.screen[i - 1].leftHand.id ? "/" : cleanString(c.leftHand.description) + "(" + c.leftHand.tier + ")"}</th>
                          //     <th>{i !== 0 && c.rightHand.id === playerOff.screen[i - 1].rightHand.id ? "/" : cleanString(c.rightHand.description) + "(" + c.rightHand.tier + ")"}</th>
                          //     <th>{i !== 0 && c.shoes.id === playerOff.screen[i - 1].shoes.id ? "/" : cleanString(c.shoes.description) + "(" + c.shoes.tier + ")"}</th>
                          //     <th>{i !== 0 && c.horse.id === playerOff.screen[i - 1].horse.id ? "/" : cleanString(c.horse.description) + "(" + c.horse.tier + ")"}</th>
                          //   </tr>
                          // </tbody>

                        )

                      })}
                    </table>
                  </div>
                </li>
              )
            })}
          </ul>} */}
      </div>
    </>
  )
}
