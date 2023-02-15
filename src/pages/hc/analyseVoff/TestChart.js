import React, { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

export default function TestChart(props) {

    function dataFromOneAttaqueAndOneSpeed(att, labels) {
        // console.log("======================================")
        // console.log(att)
        let ans = [];
        labels.map((lvl, index) => {
            // console.log(lvl, index)
            let a = att.find(data => data.pt === parseInt(lvl));
            // console.log(a)
            if (a) {
                if (a.speed.includes(speed)) {
                    ans.push(1);
                } else {
                    ans.push(0);
                }
            } else {
                ans.push(0);
            }
        });

        let alwaysOne = true;
        let alwaysZero = true;

        ans.forEach(el => {
            if (el === 0)
                alwaysOne = false;
            if (el === 1)
                alwaysZero = false;
        })

        if (alwaysOne || alwaysZero) {
            return []
        } else {
            return ans;
        }
    }

    function buildData(attaques, labels) {

        // console.log(attaques)
        attaques = attaques.filter(el => el.length !== 0)
        // console.log(attaques)
        let datasets = [];

        // [attaques[0]].forEach((att, index) => {
        let freshData = [];
        if (speed) {
            attaques.forEach((att, index) => {
                // console.log(index % 5)
                // console.log(att)
                if (att.length > 0) {
                    let a = (dataFromOneAttaqueAndOneSpeed(att, labels));
                    if (a.length > 0)
                        freshData.push(a)
                    // datasets.push({
                    //     label: "att : " + (index + 1),
                    //     data: temp,
                    //     backgroundColor:
                    //         index % 5 === 0 ? '#EF476F' :
                    //             index % 5 === 1 ? '#FFD166' :
                    //                 index % 5 === 2 ? '#06D6A0' :
                    //                     index % 5 === 3 ? '#118AB2' : '#073B4C',
                    // })
                }

            })
        }
        // console.log(freshData)
        if (speed) {
            freshData.forEach((temp, index) => {
                // console.log(index % 5)
                // console.log(att)
                // if (att.length > 0) {
                // let temp = dataFromOneAttaqueAndOneSpeed(att, labels);
                datasets.push({
                    label: "att : " + (index + 1),
                    data: temp,
                    backgroundColor:
                        index % 5 === 0 ? '#EF476F' :
                            index % 5 === 1 ? '#FFD166' :
                                index % 5 === 2 ? '#06D6A0' :
                                    index % 5 === 3 ? '#118AB2' : '#073B4C',
                })
                // }

            })
        }
        const data = {
            labels,
            datasets: datasets,
            // options: {
            //     plugins: {
            //         title: {
            //             display: true,
            //             text: 'Chart.js Bar Chart - Stacked'
            //         },
            //     },
            // }
        }
        // console.log(data)
        return data;
    }

    const [speed, setSpeed] = useState(false)
    const [attaques, setAttaques] = useState()
    useEffect(() => {
        let speedOk = false;
        if (props.speed[0]) {
            speedOk = 3;
        } else if (props.speed[1]) {
            speedOk = 4;
        } else if (props.speed[2]) {
            speedOk = 5;
        }
        setSpeed(speedOk)
    }, [props.speed])

    // useEffect(() => {
    //     console.log(speed, props.attaques)
    // }, [speed])
    const options = {
        plugins: {
            //     title: {
            //         display: true,
            //         text: 'Chart.js Bar Chart - Stacked',
            //     },
            // legend: {
            //     onHover: handleHover,
            //     onLeave: handleLeave
            //   },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
            // title: {
            //     display: false
            // },
            // display: false
        },
        // options: {
        //     plugins: {
        //         title: {
        //             display: true,
        //             text: 'Chart.js Bar Chart - Stacked'
        //         },
        //     },
        // }

    };

    const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

    const data = {
        labels,
        datasets: [
            {
                label: '',
                data: labels.map(() => Math.random(0, 20)),
                backgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Dataset 2',
                data: labels.map(() => Math.random(0, 20)),
                backgroundColor: 'rgb(75, 192, 192)',
            },
            {
                label: 'Dataset 3',
                data: labels.map(() => Math.random(0, 20)),
                backgroundColor: 'rgb(53, 162, 235)',
            },
        ],
    };

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    return (
        <>
            {/* <div>TestChart</div> */}
            {speed && props.attaques && props.attaques.length > 0 &&
                < Bar
                    options={options}
                    // data={data} 
                    data={buildData(props.attaques, labels)}
                />}
        </>
    )
}
