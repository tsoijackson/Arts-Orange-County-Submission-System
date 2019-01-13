import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Button, Icon, Row, Input, Col, Modal, Toast } from 'react-materialize';
import LocationSearchInput from './googleMapApi.js';
import StudentEntry from './studentEntries.js';
import Api from './Api';
import axios from 'axios';
import settingsFile from './settings.json';
import UserProfile from './components/changeForm/userProfile.js';
import $ from 'jquery';

class ChangeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: JSON.parse(JSON.stringify(settingsFile)),
      userEmail: this.props.match.params.unique_url,
      user_id: "",
      max_id: 0,
      applicants: {},
      deletions: {},
      additions: {}
    };
  }

  componentDidMount() {
    console.log("modify")
    let apiString = '/api/submissions/' + this.props.match.params.unique_url

    window.$("#combo-warning-modal").modal("open")

    Api.get(apiString)
      .then((ret_1) => {
        var applicant_dict = {}
        let tempArray = ret_1.data
        console.log(tempArray)
        for (var index = 0; index < tempArray.length; index++) {
          applicant_dict[tempArray[index]["submission_id"]] = tempArray[index]
        }
        console.log(applicant_dict)
        this.setState({
          applicants: applicant_dict,
          deletions: {},
          additions: {}
        })
      })
  }
  removeStudentEntry = (id) => {
    console.log("removeStudentEntry called")
    let applicants = this.state.applicants
    let additions = this.state.additions
    let deletions = this.state.deletions
    if (!(id in this.state.additions)) {
      deletions[id] = applicants[id]
    }
    delete applicants[id]
    delete additions[id]
    this.setState({
      applicants: applicants,
      deletions: deletions,
      additions: additions
    })
  }
  addStudentEntry = () => {
    let applicant_num = 1 + this.state.max_id;
    this.setState ({
      max_id: applicant_num
    })

    let applicants = this.state.applicants;
    let additions = this.state.additions

    additions[applicant_num] = {}
    applicants[applicant_num] = {}
    this.setState({
      applicants: applicants,
      additions: additions
    })
  }
  extractArtistEntries = (givenDict, id) => {
    console.log(givenDict)
    let tempArray = this.state.applicants;
    tempArray[id] = givenDict
    this.setState({
      applicants: tempArray
    });
  }
  extractRegisterID = (user_id) => {
    this.setState({
      user_id: user_id
    })
  }

  submitStudentEntry = () => {

    // console.log(this.state.applicants)
    // console.log(this.state.additions)
    if (Object.keys(this.state.deletions).length <= 0 && Object.keys(this.state.additions).length <= 0) {
      this.modAction()
    }
    this.deletionAction()
    this.postAction()
  }

  deletionAction = () => {
    // deletions
    if (Object.keys(this.state.deletions).length > 0) {
      window.Materialize.toast("Beginning to delete the entries!", 10000)
      console.log("deleting")
      console.log(this.state.deletions)
      var deletion_list = []

      for (var key in this.state.deletions){
        deletion_list.push(this.state.deletions[key]["submission_id"])
      }
      let result_json = {
        "submissions": deletion_list
      }
      console.log(result_json)
      result_json = JSON.stringify(result_json)
      console.log(result_json)
      setTimeout(function(){
        console.log('after');
      },1000);
      console.log("begin deleting")
      Api.del('/api/submissions', result_json)
        .then((ret_2) => {
          console.log(ret_2)
          window.Materialize.toast("Successfully deleted the entries!", 10000)
          setTimeout(function(){
            console.log('after');
          },5000);
          this.modAction()
        })
        .catch((error) => {
          console.log(error)
          window.$("#backend-alert-modal").modal("open")
        })
      // deletion is reset to 0
      this.setState({deletions: {}})
    }
  }


  postAction = async() => {
    var verify_outcome = await(this.registerVerify())
    if( verify_outcome && Object.keys(this.state.additions).length > 0) {
      window.Materialize.toast("Beginning to add the entries!", 10000)
      console.log("adding")
      for (var key in this.state.additions) {
        this.state.additions[key] = this.state.applicants[key]
      }
      var result_array = []
      console.log(this.state.additions)
      for (var key in this.state.additions) {
        var temp_json = this.state.additions[key]
        console.log(temp_json)
        temp_json["user_id"] = this.state.user_id
        temp_json["submission_id"] = ""
        temp_json["last_updated"] = ""
        temp_json["school_address"] = ""
        temp_json["parent_email"] = ""
        temp_json["artwork_votes"] = 0
        result_array.push(temp_json)
      }
      let result_json = {
        "submissions": result_array
      }
      result_json = JSON.stringify(result_json)
      console.log(result_json)
      Api.post('/api/submissions', result_json)
      .then((ret_2) => {
        console.log(ret_2)
        window.Materialize.toast("Successfully added the entries!", 10000)
        // this.modAction()
        // localStorage.setItem("applicants", JSON.stringify(this.state.applicants))
        // window.$("#combo-reminder-modal").modal("open")
        window.location.reload()
      })
      .catch((error) => {
        window.$("#backend-alert-modal").modal("open")
      })
      this.setState({additions: {}})
    }
  }

  modAction = async() => {
    var verify_outcome = await(this.registerVerify())
    if (verify_outcome && Object.keys(this.state.applicants).length > 0) {
      console.log("modifying")
      window.Materialize.toast("Beginning to modify the entries!", 10000)
      var result_array = []

      for (var key in this.state.applicants) {
        console.log(temp_json)
        var temp_json = this.state.applicants[key]
        temp_json["user_id"] = this.state.user_id
        temp_json["parent_email"] = ""
        // temp_json["submission_id"] = null
        // temp_json["last_updated"] = null
        // temp_json["school_address"] = null
        temp_json["artwork_votes"] = 0
        result_array.push(temp_json)
      }
      let result_json = {
        "submissions": result_array
      }
      result_json = JSON.stringify(result_json)
      console.log(result_json)
      Api.put('/api/submissions', result_json).then((ret_3) => {
        console.log(ret_3)
        window.Materialize.toast("Successfully modified the entries!", 10000)
      })
    }
  }

  registerVerify = async() => {
    var columnResult = await(this.columnCheck())
    if (columnResult == true) {
      var filledNum = $("input").filter(function () {
        return $.trim($(this).val()).length == 0
      }).length
      console.log("filledNum")
      console.log(filledNum)
      if (filledNum > 0) {
        window.$("#fill-alert-modal").modal("open")
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  columnCheck = async() => {
    $('input').each(function(index,data) {
       var value = $(this).val();
       if (value.includes("Select")) {
         window.$("#dropdown-alert-modal").modal("open")
         return false
       }
    });
    return true
  }

  render() {
    return (
      <div id="change-form-wrapper">
        <h3> Modify </h3>
        <UserProfile userEmail = { this.state.userEmail } extractUserID = {this.extractRegisterID}/>
        <Row>
          <Col s={11}>
            <div className="sub-header"> Artist Entries </div>
          </Col>
          <Col s={1}>
            <div><Button floating large id="student-btn" waves='light' className='blue' icon='add'
              onClick={() => this.addStudentEntry()}></Button></div>
          </Col>
        </Row>
        {Object.keys(this.state.applicants).sort().map((key) => {
          return <div className={"row"} key={key}>
            <Col s={11}>
              <StudentEntry id={key} currentVal={this.state.applicants[key]} pushApplicantData={this.extractArtistEntries}></StudentEntry>
            </Col>
            <Col s={1}>
              <Button floating large waves='light' className='red' icon='delete'
                onClick={() => this.removeStudentEntry(key)}></Button>
            </Col>
          </div>
        })}
        <div id="submission-btn-wrapper">
          <Button waves='light' id="sub-btn" onClick={() => this.submitStudentEntry()}>Submit</Button>
        </div>
        <Modal id='fill-alert-modal' header="Error">
          Fill in all of the entries!
        </Modal>
        <Modal id='email-alert-modal' header="Error">
          Please ensure all of the formatting for email entries are correct!
        </Modal>
        <Modal id="dropdown-alert-modal" header="Error">
          Not all of the dropdowns are filled!
        </Modal>
        <Modal id="backend-alert-modal" header="Error">
          There was a problem with the backend. Please try again!
        </Modal>
        <Modal id="combo-warning-modal" header="Warning">
          We are currently encountering a technical issue with the combination of adding and modifying entries.
          Please perform these two tasks seperately.
        </Modal>
        <Modal id="combo-reminder-modal" header="Reminder">
          Friendly reminder to modify your entries again because there is currently technical issue with the combination of adding and modifying entries!
        </Modal>
        <Modal id='confirm-alert-modal' header="Confirmation">
          <div id="confirm-alert-body"></div>
        </Modal>
      </div>
    )
  }
}
export default ChangeForm
