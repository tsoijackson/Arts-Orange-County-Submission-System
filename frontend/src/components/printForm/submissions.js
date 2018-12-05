import React, { Component } from 'react';
import axios from 'axios';
import settingsFile from '../../settings.json';
import SubmissionLabel from './submissionLabel.js';
import './style.css';

class Submissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: JSON.parse(JSON.stringify(settingsFile)),
            userEmail: props.userEmail,
            submissions: []
        };
    }

    componentDidMount() {
        const url = "http://" + this.state.settings.backend.server + ":" + this.state.settings.backend.port + this.state.settings.backend.constUrl + "/submissions/" + this.state.userEmail;
        axios
            .get(url)
            .then(response => {
                this.setState({ submissions: response.data })
                console.log(this.state)
            })
            .catch(error => console.log(error));
    }

    render() {
        var list = []
        this.state.submissions.forEach(submission => {
            list.push(
            <div className="label">

                <div className="header">
                    Arts Orange County Submission Label 
                    <br></br>
                    <br></br>
                    <hr></hr>
                </div>

                <div className="info">
                    <SubmissionLabel submission={ submission } />
                </div>
            </div>
            )
        })

        return list;
    }
}

export default Submissions