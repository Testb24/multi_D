import React, { useEffect, useState } from 'react';
import { Parse_Profil, CRUD_getAll, CRUD_get } from './AnalyseProfil_functions.js'
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

  function handleSubmit(e) {
    e.preventDefault();
    const attaques = Parse_Profil(str);
    // console.log("===========")
    // console.log(attaques)
    // setAttaques(attaques);

    // setStr('');
    M.toast({ html: 'Saved', displayLength: 3000 });
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
    let PlayerWatched_Uid = []

    temp.forEach(profil => {
      PlayerWatched_Uid.push(profil.Uid);
    })
    // console.log(PlayerWatched_Uid)
    PlayerWatched_Uid = PlayerWatched_Uid.filter((el, i) => i === PlayerWatched_Uid.findIndex(e => e === el))
    // console.log(PlayerWatched_Uid)

    let PlayerWatched_fullData = [];
    PlayerWatched_Uid.map((Uid, i) => {

      let PlayerData = {
        Uid: Uid,
        Un: temp.find(el => el.Uid === Uid).Un,
        screen: temp.filter(el => el.Uid === Uid).sort((a, b) => a.time - b.time),
        i: i
      }

      PlayerWatched_fullData.push(PlayerData);
    })
    // console.log(PlayerWatched_fullData);

    setTrackedAcc(PlayerWatched_fullData);
  }

  // document.addEventListener('DOMContentLoaded', function () {
  //   var elems = document.querySelectorAll('.collapsible');
  //   var instances = M.Collapsible.init(elems);
  // });

  useEffect(() => {
    M.AutoInit();
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
        {trackedAcc && trackedAcc.length > 0 &&
          <ul className="collapsible">
            {trackedAcc.map((playerOff, index1) => {
              // console.log(playerOff)
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
                      {/* <thead>
                        <tr>
                          <th>Heure screen</th>
                          <th>points off</th>
                          <th>points def</th>
                          <th>XP héros</th>
                          <th>Casque</th>
                          <th>Corps</th>
                          <th>Bras gauche</th>
                          <th>Bras droit</th>
                          <th>Chaussures</th>
                          <th>Monture</th>
                        </tr>
                      </thead> */}

                      <thead>
                        <tr>
                          <th><div
                            style={{
                              width: "22px",
                              height: "22px",
                              backgroundImage: "url(" + img_clock + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "26px",
                              height: "22px",
                              backgroundImage: "url(" + img_attack + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "22px",
                              height: "24px",
                              backgroundImage: "url(" + img_defence + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "24px",
                              height: "20px",
                              backgroundImage: "url(" + img_xp + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "-0px 0", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -26px ", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -52px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -78px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -104px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                          <th><div
                            style={{
                              width: "26px",
                              height: "26px",
                              backgroundImage: "url(" + img_stuff + ")",
                              backgroundPosition: "0 -130px", //26
                              // border:"1px solid white"
                              margin: "auto"
                            }}
                          /></th>
                        </tr>
                      </thead>

                      {playerOff.screen.map((c, i) => {
                        // console.log(c)
                        // if (i > 0) {
                        // console.log(c.rightHand.id)
                        // console.log(playerOff.screen[i - 1].rightHand.id)
                        // }
                        
                        return (
                          <tbody key={i}>
                            <tr>
                              {/* <th>{c.time ? new Date(c.time).toLocaleString() : "<!>"}</th> */}
                              {/* <th>{"\u00c9"}</th>
                              <th>{"'"}</th>
                              <th>{"Armure \d&#39;\u00e9caille"}</th> */}
                              <th>{c.time ? new Date(c.time).toLocaleTimeString() : "<!>"}</th>
                              <th>{i !== 0 && c.ptOff === playerOff.screen[i - 1].ptOff ? "/" : c.ptOff}</th>
                              <th>{i !== 0 && c.ptDef === playerOff.screen[i - 1].ptDef ? "/" : c.ptDef}</th>
                              <th>{i !== 0 && c.xpZ === playerOff.screen[i - 1].xpZ ? "/" : c.xpZ}</th>
                              <th>{i !== 0 && c.helmet.id === playerOff.screen[i - 1].helmet.id ? "/" : c.helmet.description + "(" + c.helmet.tier + ")"}</th>
                              <th>{i !== 0 && c.body.id === playerOff.screen[i - 1].body.id ? "/" : c.body.description + "(" + c.body.tier + ")"}</th>
                              {/* <th>{c.body.description}</th>
                              <th>{decodeURIComponent(c.body.description)}</th>
                              <th>{c.body.description.normalize('NFC')}</th>
                              <th>{c.body.description.normalize('NFD')}</th> */}
                              <th>{i !== 0 && c.leftHand.id === playerOff.screen[i - 1].leftHand.id ? "/" : c.leftHand.description + "(" + c.leftHand.tier + ")"}</th>
                              <th>{i !== 0 && c.rightHand.id === playerOff.screen[i - 1].rightHand.id ? "/" : c.rightHand.description + "(" + c.rightHand.tier + ")"}</th>
                              <th>{i !== 0 && c.shoes.id === playerOff.screen[i - 1].shoes.id ? "/" : c.shoes.description + "(" + c.shoes.tier + ")"}</th>
                              <th>{i !== 0 && c.horse.id === playerOff.screen[i - 1].horse.id ? "/" : c.horse.description + "(" + c.horse.tier + ")"}</th>
                            </tr>
                          </tbody>
                        )

                      })}
                    </table>
                  </div>

                  {/* <div>
                      {playerOff.last ? new Date(playerOff.last).toLocaleString() : "<!>"}
                      </div>
                    <th>{(new Date() - playerOff.last < 3600 * 1000 ? "ok" : "f")} </th>
                    <th>{(new Date() - playerOff.last) / 3600 / 1000 < 0.5} </th>
                    <div>{playerOff.last !== 0 &&
                      Math.floor((new Date() - playerOff.last) / 3600000) % 3600 + 'h ' +
                      Math.floor((new Date() - playerOff.last) / 60000) % 60 + 'min ' +
                      Math.floor((new Date() - playerOff.last) / 1000) % 60 + 's '
                    }
                    </div> */}
                  {/* </div> */}
                </li>
              )
            })}
          </ul>}
      </div>
    </>
  )
}
