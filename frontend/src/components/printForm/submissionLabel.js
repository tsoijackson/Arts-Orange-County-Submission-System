import React, { Component } from 'react';


class SubmissionLabel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submission: props.submission
        };
    }

    render() {
        var submissionAttributes = []
        for (var key in this.state.submission) {
            if (!["user_id", "artwork_votes", "last_updated"].includes(key)) {
                var attribute = key + " : " + this.state.submission[key]
                submissionAttributes.push(<li key={ key }> { attribute } </li>)
                if (["submission_id","user_email", "artwork_medium", "district_name"].includes(key)) {
                    submissionAttributes.push(<br></br>)
                }
            }
        }
        return (
            <ul>
                { submissionAttributes }
            </ul>
        )
    }
}

export default SubmissionLabel