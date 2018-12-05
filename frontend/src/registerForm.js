import React, { Component } from 'react';
import {Link,Route,Switch} from 'react-router-dom';
import $ from 'jquery';
import {Button, Icon, Row, Input, Col, Modal} from 'react-materialize';
import StudentEntry from './studentEntries.js';
import Api from './Api';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp_id: "",
      submitterFname: "",
      submitterLname: "",
      submitterTitle: "",
      submitterEmail: "",
      applicants: {}
    }
  }

  componentWillMount() {
    let applicants = this.state.applicants
    applicants[1] = {}
    this.setState ({
      applicants: applicants,
    })
  }

  removeStudentEntry = (id) => {
    // console.log("removeStudentEntry called")
    let applicants = this.state.applicants
    delete applicants[id]
    this.setState({
      applicants:applicants,
    })
  }

  addStudentEntry = () => {
    let random_num = Math.floor(Math.random()*1000) + 1;
    let applicants = this.state.applicants;
    applicants[random_num] = {}
    this.setState({
      applicants: applicants
    })
    // console.log(this.state.applicants)
  }

  extractArtistEntries = (givenDict, id) => {
    console.log("extracting artist entries")
    let tempArray = this.state.applicants;
    console.log(givenDict)
    tempArray[id] = givenDict
    this.setState({
      applicants: tempArray
    });
    console.log(this.state.applicants)
  }

  submitStudentEntry = () => {
    let submitter_data = {
      "user_first_name": String(this.state.submitterFname),
      "user_last_name": String(this.state.submitterLname),
      "user_title": String(this.state.submitterTitle),
      "user_email": String(this.state.submitterEmail)
    }
    var submitter_json = JSON.stringify(submitter_data)

    if (this.registerVerify()) {
      Api.post('/api/users', submitter_json)
      .then((ret_1) => {
        // artist submissions
        var result_array = []
        for (var key in this.state.applicants) {
          var temp_json = this.state.applicants[key]
          temp_json["user_id"] = ret_1['data']['user_id']
          temp_json["submission_id"] = ""
          temp_json["last_updated"] = ""
          temp_json["school_address"] = ""
          temp_json["artwork_votes"] = 0
          result_array.push(temp_json)
        }
        let result_json = {
          "submissions": result_array
        }
        result_json = JSON.stringify(result_json)
        console.log(result_json)
        Api.post('/api/submissions', result_json).then((ret_2) => {
          let confirmation_msg = "Congragulation! All of the entries have been registered" +
          "\n" + "Make future changes using this url: " + "http://167.99.109.168:3000/modify/" + this.state.submitterEmail
          document.getElementById("confirm-alert-body").innerHTML = confirmation_msg
          window.$("#confirm-alert-modal").modal("open")
        })
        .catch((error) => {
          window.$("#dropdown-alert-modal").modal("open")
        })
      })
      .catch((error) => {
        console.log(error)
        window.$("#duplicate-alert-modal").modal("open")
      })
    }
  }

  registerVerify = () => {
      var filledNum = $("input").filter(function () {
        return $.trim($(this).val()).length == 0
      }).length
      if (filledNum) {
        window.$("#fill-alert-modal").modal("open")
        return false
      } else {
        // check to see if the register email is correct
        // console.log(this.isEmail(this.state.submitterEmail))
        if (this.isEmail(this.state.submitterEmail) === false){
          window.$("#email-alert-modal").modal("open")
          return false
        }
        // check to see if the parent email is correct
        for (var key in this.state.applicants) {
          var temp_json = this.state.applicants[key]
          // console.log(temp_json["parent_email"])
          if (this.isEmail(temp_json["parent_email"]) === false){
            window.$("#email-alert-modal").modal("open")
            return false
          }
        }
      }
      return true
  }

  isEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  extractVal = (stateVar, event) => {
    // console.log(event.target.value)
    this.setState({
      [stateVar]: event.target.value
    });
  }

  render() {
    return (
      <div id="register-form-wrapper">
        <h3> Register </h3>
        <Row id="register-entry-wrapper">
            <Input s={6} label="First Name" value={this.state.submitterFname} onChange={(evt) => this.extractVal("submitterFname", evt)}/>
            <Input s={6} label="Last Name" value={this.state.submitterLname} onChange={(evt) => this.extractVal("submitterLname", evt)}/>
            <Input s={12} type='select' value={this.state.submitterTitle} onChange={(evt) => this.extractVal("submitterTitle", evt)} label="Title">
              <option value=''> Select your Position or Title </option>
              <option value='ArtTeacher'> Art Teacher </option>
              <option value='VATeacher'> Visual Arts Teacher </option>
              <option value='Parent'> Parent </option>
              <option value='ArtInstructor'> Art Instructor </option>
            </Input>
            <Input s={12} label="Email" type="email" validate defaultValue={this.state.submitterEmail} onChange={(evt) => this.extractVal("submitterEmail", evt)} />
        </Row>

        <div id="student-entry-wrapper">
          <Row>
            <Col s={11}>
              <div className="sub-header"> Artist Entries </div>
            </Col>
            <Col s={1}>
              <div><Button floating large id="student-btn" waves='light' className='blue' icon='add'
              onClick={() => this.addStudentEntry()}></Button></div>
            </Col>
          </Row>
          {Object.keys(this.state.applicants).sort().reverse().map((key) => {
              return  <div className={"row"} key={key}>
                        <Col s={11}>
                          <StudentEntry id={key} currentVal={this.state.applicants[key]} pushApplicantData={this.extractArtistEntries}></StudentEntry>
                        </Col>
                        <Col s={1}>
                          <Button floating large waves='light' className='red' icon='delete'
                          onClick={() => this.removeStudentEntry(key)}></Button>
                        </Col>
                      </div>
              })}
        </div>
        <div id="submission-btn-wrapper">
          <Button waves='light' id="sub-btn" onClick={()=>this.submitStudentEntry()}>Submit</Button>
        </div>
        <Modal id='fill-alert-modal' header="Error">
          Fill in all of the entries!
        </Modal>
        <Modal id='email-alert-modal' header="Error">
          Please ensure all of the formatting for email entries are correct!
        </Modal>
        <Modal id='duplicate-alert-modal' header="Error">
          This email has already been used for registration! It cannot be used again.
        </Modal>
        <Modal id="dropdown-alert-modal" header="Error">
          Please ensure all of the dropdown are selected!
        </Modal>
        <Modal id='confirm-alert-modal' header="Confirmation">
          <div id="confirm-alert-body"></div>
        </Modal>
      </div>
    )
  }
}
export default RegisterForm
