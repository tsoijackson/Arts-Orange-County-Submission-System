import React, { Component } from 'react';
import Submissions from './submissions.js';


class PrintForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: props.match.params.user_email,
        };
    }

    render() {
        return (
            <Submissions userEmail={ this.state.userEmail } />
        )
    }
}
export default PrintForm