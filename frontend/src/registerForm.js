import React, { Component } from 'react';
import {Link,Route,Switch} from 'react-router-dom';
import $ from 'jquery';
import {Button, Icon, Row, Input, Col, Modal, Autocomplete} from 'react-materialize';
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
      max_id: 1,
      submitterChecked: false,
      submitterConfirmEmail: "",
      submitterGlobalSchool: "",

      applicants: {},
      schools: {},
      display_school: {}
    }
  }

  componentWillMount() {
    let applicants = this.state.applicants
    applicants[1] = {}
    this.setState ({
      applicants: applicants,
    })
    this.extractSchools()
  }

  componentDidMount() {
    window.$("#welcome-modal").modal("open")
  }

  extractSchools = () => {
    let apiString = '/api/schools'
    Api.get(apiString)
      .then((ret_1) => {
        let school_dict = {}
        for(var school of ret_1["data"]) {
          school_dict[school["school_name"]] = String(school["district_name"])
        }
        this.setState ({
          schools: school_dict
        }, function(){
          let school_list = {}
          for (var school in this.state.schools) {
            school_list[school] = null
          }
          this.setState({display_school:school_list}, function(){
            console.log(this.state.display_school)
          })
        })
      })
      .catch((error) => {
        console.log(error)
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
    let applicant_num = 1 + this.state.max_id;
    this.setState ({
      max_id: applicant_num
    })
    let applicants = this.state.applicants;
    applicants[applicant_num] = {}
    this.setState({
      applicants: applicants
    })
  }

  extractArtistEntries = (givenDict, id) => {
    console.log(givenDict)
    let tempArray = this.state.applicants;
    tempArray[id] = givenDict
    this.setState({
      applicants: tempArray
    });
    // console.log(this.state.applicants)
  }

  submitStudentEntry = async() => {
    let submitter_data = {
      "user_first_name": String(this.state.submitterFname),
      "user_last_name": String(this.state.submitterLname),
      "user_title": String(this.state.submitterTitle),
      "user_email": String(this.state.submitterEmail)
    }
    var submitter_json = JSON.stringify(submitter_data)
    var verify_outcome = await(this.registerVerify())
    console.log(verify_outcome)
    if (verify_outcome) {
      console.log("too early")
      if (window.$("#registerEmail").is(":invalid")) {
        window.$("#email-alert-modal").modal("open")
        return false
      }
      Api.post('/api/users', submitter_json)
      .then((ret_1) => {
        // artist submissions
        var result_array = []
        for (var key in this.state.applicants) {
          var temp_json = this.state.applicants[key]
          let global_school = this.state.submitterGlobalSchool
          console.log(global_school)
          console.log(this.state.schools[global_school])
          if (global_school !== "") {
            temp_json["school_name"] = global_school
            temp_json["district_name"] = this.state.schools[global_school]
          }
          temp_json["user_id"] = ret_1['data']['user_id']
          temp_json["submission_id"] = null
          temp_json["last_updated"] = null
          temp_json["school_address"] = null
          temp_json["parent_email"] = null
          temp_json["artwork_votes"] = 0
          result_array.push(temp_json)
        }
        let result_json = {
          "submissions": result_array
        }
        result_json = JSON.stringify(result_json)
        Api.post('/api/submissions', result_json).then((ret_2) => {
          var currNode = document.getElementById("confirm-alert-body");
          while (currNode.firstChild) {
            currNode.removeChild(currNode.firstChild);
          }
          let link = document.createElement("a")
          link.href = "http://167.99.109.168:8080/#/modify/" + this.state.submitterEmail
          link.innerHTML = "http://167.99.109.168:8080/#/modify/" + this.state.submitterEmail
          let confirmation_msg = document.createElement("div")
          confirmation_msg.innerHTML =
            "Congratulations! All of the entries have been registered and submitted. <br>"+
            "If you're looking to edit previous entries or make future changes please use this url: <br><br>"
          document.getElementById("confirm-alert-body").appendChild(confirmation_msg)
          document.getElementById("confirm-alert-body").appendChild(link)
          window.$("#confirm-alert-modal").modal("open")
        })
        .catch((error) => {
          window.$("#backend-alert-modal").modal("open")
        })
      })
      .catch((error) => {
        window.$("#duplicate-alert-modal").modal("open")
      })
    }
  }

  registerVerify = async() => {
      var emailResult = await(this.emailCheck())
      var columnResult = await(this.columnCheck())

      if (emailResult === true && columnResult === true) {
        var filledNum = $("input").filter(function () {
          return $.trim($(this).val()).length == 0
        }).length
        if (this.state.submitterGlobalSchool !== "") {
          filledNum = filledNum - Object.keys(this.state.applicants).length
        } else {
          filledNum = filledNum - 1
        }
        console.log(filledNum)
        if (filledNum > 0) {
          window.$("#fill-alert-modal").modal("open")
          return false
        }
        return true
      } else {
        return false
      }
  }

  emailCheck = async() => {
    if (this.state.submitterEmail != this.state.submitterConfirmEmail) {
      window.$("#emailsame-alert-modal").modal("open")
      return false
    } else {
      return true
    }
  }

  columnCheck = async() => {
    console.log("columnCheck")
    $('input').each(function(index,data) {
       var value = $(this).val();
       if (value.includes("Select")) {
         window.$("#dropdown-alert-modal").modal("open")
         return false
       }
    });
    return true
  }

  extractVal = (stateVar, event) => {
    if (stateVar ==="submitterGlobalSchool") {
      this.setState({[stateVar]: event}, function(){
        console.log(this.state.submitterGlobalSchool)
      })
    } else {
      this.setState({
        [stateVar]: event.target.value.toLowerCase()
      });
      console.log(event.target.value.toLowerCase())
    }
  }

  render() {
    return (
      <div id="register-form-wrapper">
        <h2> Register </h2>
        <Row id="register-entry-wrapper">
            <Input s={6} validate label="First Name" defaultValue={this.state.submitterFname} onBlur={(evt) => this.extractVal("submitterFname", evt)}/>
            <Input s={6} validate label="Last Name" defaultValue={this.state.submitterLname} onBlur={(evt) => this.extractVal("submitterLname", evt)}/>

            <Input s={6} validate id="registerEmail" label="Email" type="email" defaultValue={this.state.submitterEmail} onBlur={(evt) => this.extractVal("submitterEmail", evt)} />
            <Input s={6} validate label="Confirm Email" type="email" defaultValue={this.state.submitterConfirmEmail} onBlur={(evt) => this.extractVal("submitterConfirmEmail", evt)} />

            <Input s={6} validate type='select' defaultValue={this.state.submitterTitle} onChange={(evt) => this.extractVal("submitterTitle", evt)} >
              <option value=''> Select Your Title </option>
              <option value='artteacher'> Art Teacher </option>
              <option value='vateacher'> Visual Arts Teacher </option>
              <option value='parent'> Parent </option>
              <option value='student'> Student </option>
              <option value='artinstructor'> Art Instructor </option>
            </Input>

            <Autocomplete s={6} id="schoolname_input" value={this.state.school_name}  onAutocomplete={(value) => this.extractVal("submitterGlobalSchool", value, null) }
              data={this.state.display_school} title="Type here to select the same school for all artists" submitterGlobalSchool={this.state.submitterGlobalSchool}
            >
            </Autocomplete>

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
                          <StudentEntry id={key} schools={this.state.schools} school_display={this.state.display_school}
                          currentVal={this.state.applicants[key]} pushApplicantData={this.extractArtistEntries} globalSchool={this.state.submitterGlobalSchool}></StudentEntry>
                        </Col>
                        <Col s={1}>
                          <Button floating large waves='light' className='red' icon='delete'
                          onClick={() => this.removeStudentEntry(key)}></Button>
                        </Col>
                      </div>
              })}
        </div>
        <div id="submission-btn-wrapper">
          <Button large className='green' waves='light' id="sub-btn" onClick={()=>this.submitStudentEntry()}>Submit</Button>
        </div>

        <Modal id='fill-alert-modal' header="Error">
          Fill in all of the entries!
        </Modal>
        <Modal id="welcome-modal" header="Welcome">
          Thank you for your interest in entering the Imagination Celebration 1000 Pieces Visual Arts Exhibition
          This form is for entries to the “1000 Pieces” exhibition which takes place at South Coast Plaza.
          This form accepts entries for 2D (Two-Dimensional) art only in these categories: Traditional Media, Photography and Digital.
          For all other exhibitions or information about the Imagination Celebration, please visit <a href="http://artsoc.org/">http://artsoc.org</a>.
        </Modal>
        <Modal id='email-alert-modal' header="Error">
          Please ensure all of the formatting for email entries are correct!
        </Modal>
        <Modal id='duplicate-alert-modal' header="Error">
          This email has already been used for registration! It cannot be used again.
        </Modal>
        <Modal id="dropdown-alert-modal" header="Error">
          Not all of the dropdowns are filled!
        </Modal>
        <Modal id="backend-alert-modal" header="Error">
          There was a problem with the backend. Please try again!
        </Modal>
        <Modal id='confirm-alert-modal' header="Confirmation">
          <div id="confirm-alert-body"></div>
        </Modal>
        <Modal id="emailsame-alert-modal" header="Error">
          Your email does not match with the confirmed email!
        </Modal>
      </div>
    )
  }
}
export default RegisterForm
