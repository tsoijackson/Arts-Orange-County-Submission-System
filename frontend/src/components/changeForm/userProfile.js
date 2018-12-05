import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import settingsFile from '../../settings.json';
import { Button, Icon, Row, Input, Col, Card, CardTitle } from 'react-materialize';
import './style.css';


class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: JSON.parse(JSON.stringify(settingsFile)),
            userEmail: props.userEmail,
            userProfile: []
        };
    }

    componentDidMount() {
        const url = "http://" + this.state.settings.backend.server + ":" + this.state.settings.backend.port + this.state.settings.backend.constUrl + "/users/" + this.state.userEmail;
        axios
            .get(url)
            .then(response => {
                this.setState({ userProfile: response.data[0] }, function(){
                  console.log(this.state.userProfile)
                  this.props.extractUserID(this.state.userProfile["user_id"])
                })
            })
            .catch(error => console.log(error));
    }

    render() {
        var url = "/print/" + this.state.userEmail;

        var cardUserProfile = []
        for (var key in this.state.userProfile) {
            cardUserProfile.push(<div> <b>{key.replace(/_/g, " ")}</b> : {this.state.userProfile[key]} </div>)
        }
        return (
            <div className="user-profile">
                <Row>
                    <Col m={12} s={12}>
                        <Card className='blue-grey lighten-2'
                            textClassName='white-text'
                            title='User Profile'
                            actions={[
                                <div className='btn-print'>
                                    <Link to={ url } className='btn-print'>
                                        <Button waves='light' node='a'>
                                            <Icon left>print</Icon>
                                            Print Submission Form Labels
                                        </Button>
                                    </Link>
                                </div>]}>
                            {cardUserProfile}
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default UserProfile
