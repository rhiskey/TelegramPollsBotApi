import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import '../../css/style.css';

const chartD = {
    //userName 
    labels: [
        'User1',
        'User2',
    ],
    datasets: [{
        //Count of correct answers
        data: [0, 0],

        ////Bars
        label: 'Число правльных ответов',
        backgroundColor: 'rgba(5,121,106,0.2)',
        borderColor: 'rgba(5,121,106,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(5,121,106,0.4)',
        hoverBorderColor: 'rgba(5,121,106,1)',

        ////Doughnut
        // backgroundColor: [
        //     '#FF6384',
        //     '#36A2EB',
        //     '#FFCE56',
        //     'Yellow',
        //     'Cyan',
        //     'Magenta',
        //     'Blue',
        //     'Darkgreen',
        //     'Darkblue',
        //     'Purple'
        // ],
        // hoverBackgroundColor: [
        //     '#FF6384',
        //     '#36A2EB',
        //     '#FFCE56',
        //     'Yellow',
        //     'Cyan',
        //     'Magenta',
        //     'Blue',
        //     'Darkgreen',
        //     'Darkblue',
        //     'Purple'
        // ]
    },
    // {
    //     data: [0, 0],

    //     ////Bars
    //     label: 'Мероприятие',
    //     backgroundColor: 'rgba(262,91,25,0.2)',
    //     borderColor: 'rgba(262,91,25,1)',
    //     borderWidth: 1,
    //     hoverBackgroundColor: 'rgba(262,91,25,0.4)',
    //     hoverBorderColor: 'rgba(262,91,25,1)',

    // }
    ]
};

class BarChart extends Component {
    // displayName: 'Pie Chart',
    constructor(props) {
        super(props);

        this.state = {
            //data: [],
            rightAnswersMap: undefined,
        };
    }

    componentDidMount() {

    }

    render() {

        //Store Questions and Answers
        //this.setState({ rightAnswersMap: Map() });
        var rightAnswersMap = new Map();
        var userNames = [];
        var answers = [];
        //var events = [];

        /* Map inbound data questions result to chartdata */
        //Loop throungh ans
        this.props.data.map((recordset) => {
            var countOfRightAnswers = 0;
            var userName = recordset.name;
            //var eventName = recordset.eventName;
            
            //console.dir("Name: ", recordset.name);
            //Loop through q1-q10, count 1's => store in dictionary [Nick: CountRightAnswers, ...]
            var q1 = recordset.q1, q2 = recordset.q2, q3 = recordset.q3, q4 = recordset.q4,
                q5 = recordset.q5, q6 = recordset.q6, q7 = recordset.q7, q8 = recordset.q8,
                q9 = recordset.q9, q10 = recordset.q10;

            var qs = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];

            this.items = qs.map((q) => {
                if (q == 1) countOfRightAnswers += 1;
            });

            userNames = userNames.concat(userName);
            answers = answers.concat(countOfRightAnswers);
            //events = eventName.concat(eventName);

            //this.setState({ rightAnswersMap.set(userName, countOfRightAnswers));
            rightAnswersMap.set(userName, countOfRightAnswers);
            //this.state.chartData.labels.

        });



        chartD.labels = userNames;
        //this.state.chartData.labels = userNames;

        //datasets[1].data - другой эвент

        chartD.datasets[0].data = answers;
        // chartD.datasets[1].data = events;

        //Датасетов может быть несколько, в зависимости от мероприятия

        // console.dir(chartD.labels);
        // console.dir(rightAnswersMap);

        return (
            <div className="chart-div">
                {/* <h4>Число правильных ответов среди пользователей:</h4> */}

                {/* {this.props.data.map(recordset => (
                    <div key={recordset.id}>
                        <b>{recordset.eventName}</b>
                    </div>
                ))}               */}
                <Bar data={chartD}
                    width={100}
                    height={200}
                    options={{

                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }}
                />
            </div>
        )
    }
}

BarChart.propTypes = {
    data: PropTypes.array, //object
};
BarChart.defaultProps = {
    data: [],
}

export default BarChart;