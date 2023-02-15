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

        let ans = [];
        labels.map(lvl => {

            let a = att.find(data => data.pt === parseInt(lvl));

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

        if (ans.every(el => el === ans[0])) {
            return []
        } else {
            return ans
        }
    }

    function buildData(attaques, labels) {

        attaques = attaques.filter(el => el.length !== 0)

        let datasets = [];

        let freshData = [];
        if (speed) {
            attaques.forEach((att, index) => {

                if (att.length > 0) {
                    let a = (dataFromOneAttaqueAndOneSpeed(att, labels));
                    if (a.length > 0)
                        freshData.push(a)

                }

            })
        }

        if (speed) {
            freshData.forEach((temp, index) => {

                datasets.push({
                    label: "att : " + (index + 1),
                    data: temp,
                    backgroundColor:
                        index % 5 === 0 ? '#EF476F' :
                            index % 5 === 1 ? '#FFD166' :
                                index % 5 === 2 ? '#06D6A0' :
                                    index % 5 === 3 ? '#118AB2' : '#073B4C',
                })

            })
        }
        const data = {
            labels,
            datasets: datasets
        }

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
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            }
        }
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
            {speed && props.attaques && props.attaques.length > 0 &&
                < Bar
                    options={options}
                    data={buildData(props.attaques, labels)}
                />}
        </>
    )
}