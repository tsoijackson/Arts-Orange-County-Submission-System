import React, { Component } from 'react';
import {Link,Route,Switch} from 'react-router-dom';
import {Button, Icon, Row, Input, Col} from 'react-materialize';
import $ from 'jquery'

class StudentEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: 0,
      artist_first_name: "",
      artist_last_name: "",
      district_name: "",
      school_type: "",
      school_name: "",
      grade: 0,
      parent_first_name: "",
      parent_last_name: "",
      parent_email: "",
      artwork_title: "",
      artwork_category: "",
      artwork_medium: "",
      submission_id: "",
      last_updated: "",
      school_address: "",
      artwork_votes: 0
    }
  }

  extractVal = (stateVar, event, id) => {
    if (id !== null) {
      this.setState({[stateVar]: $("#"+id).val()}, function(){
        this.pushApplicantDataHelper()
      })
    } else {
      this.setState({[stateVar]: event.target.value}, function() {
        this.pushApplicantDataHelper()
      });
    }
  }

  deleteMarker = () => {
    this.setState((state) => {
      return {isUsed:false}
    });
  }

  // when the data is moved to the register form
  pushApplicantDataHelper = () => {
    this.setState({
      currentID: this.props.id,
    })
    var tempDict = {}
    tempDict["artist_first_name"] = this.state.artist_first_name
    tempDict["artist_last_name"] = this.state.artist_last_name
    tempDict["district_name"] = this.state.district_name
    tempDict["school_type"] = this.state.school_type
    tempDict["school_name"] = this.state.school_name
    tempDict["grade"] = this.state.grade
    tempDict["parent_first_name"] = this.state.parent_first_name
    tempDict["parent_last_name"] = this.state.parent_last_name
    tempDict["parent_email"] = this.state.parent_email
    tempDict["artwork_title"] = this.state.artwork_title
    tempDict["artwork_category"] = this.state.artwork_category
    tempDict["artwork_medium"] = this.state.artwork_medium

    tempDict["user_id"] = this.state.user_id
    tempDict["submission_id"] = this.state.submission_id
    tempDict["last_updated"] = this.state.last_updated
    tempDict["school_address"] = this.state.school_address
    tempDict["artwork_votes"] = this.state.artwork_votes

    let objectid = this.props.id
    this.props.pushApplicantData(tempDict, objectid)
  }

  // when the data is initial received for the modification page
  componentWillMount() {
      let tempVal = this.props.currentVal
      this.setState({
        artist_first_name: tempVal["artist_first_name"],
        artist_last_name: tempVal["artist_last_name"],
        district_name: tempVal["district_name"],
        school_type: tempVal["school_type"],
        school_name: tempVal["school_name"],
        grade: tempVal["grade"],
        parent_first_name: tempVal["parent_first_name"],
        parent_last_name: tempVal["parent_last_name"],
        parent_email: tempVal["parent_email"],
        artwork_title: tempVal["artwork_title"],
        artwork_category: tempVal["artwork_category"],
        artwork_medium: tempVal["artwork_medium"],

        user_id: tempVal["user_id"],
        submission_id: tempVal["submission_id"],
        last_updated: tempVal["last_updated"],
        school_address: tempVal["school_address"],
        artwork_votes: tempVal["artwork_votes"]

      })
  }

  // when the data is being passed into the student entry again
  // when the register form has changed
  componentWillReceiveProps(nextProps) {
    let tempVal = this.props.currentVal
    let currentID = this.props.id
    if (nextProps.id !== currentID) {
      this.setState({
        artist_first_name: tempVal["artist_first_name"],
        artist_last_name: tempVal["artist_last_name"],
        district_name: tempVal["district_name"],
        school_type: tempVal["school_type"],
        school_name: tempVal["school_name"],
        grade: tempVal["grade"],
        parent_first_name: tempVal["parent_first_name"],
        parent_last_name: tempVal["parent_last_name"],
        parent_email: tempVal["parent_email"],
        artwork_title: tempVal["artwork_title"],
        artwork_category: tempVal["artwork_category"],
        artwork_medium: tempVal["artwork_medium"],

        user_id: tempVal["user_id"],
        submission_id: tempVal["submission_id"],
        last_updated: tempVal["last_updated"],
        school_address: tempVal["school_address"],
        artwork_votes: tempVal["artwork_votes"]
      })
    }
  }

  render() {
    return (
          <Row id="student-entries-wrapper">
            <Input s={6} label="First Name" validate defaultValue={this.state.artist_first_name} onChange={(evt) => this.extractVal("artist_first_name", evt, null)}/>
            <Input s={6} label="Last Name" validate defaultValue={this.state.artist_last_name} onChange={(evt) => this.extractVal("artist_last_name", evt, null)}/>
            <Input s={6} type='select' id="schooltype_input" label="School Type" validate defaultValue={this.state.school_type} onChange={(evt) => this.extractVal("school_type", evt, "schooltype_input")}>
              <option> Select the Student School Type </option>
              <option defaultValue='private'> Private </option>
              <option defaultValue='public'> Public </option>
            </Input>
            <Input s={6} type='select' id="studentgrade_input" label="Student Grade" validate defaultValue={this.state.grade} onChange={(evt) => this.extractVal("grade", evt, "studentgrade_input")}>
              <option> Select the Student Grade </option>
              <option defaultValue="1"> 1st Grade </option>
              <option defaultValue="2"> 2nd Grade </option>
              <option defaultValue="3"> 3rd Grade </option>
            </Input>
            <Input s={6} type='select' id="schoolname_input" label="School" defaultValue={this.state.school_name} onChange={(evt) => this.extractVal("school_name", evt, "schoolname_input")}>
              <option> Select the Student Name </option>
              <option defaultValue='sa'> School A </option>
              <option defaultValue='sb'> School B </option>
              <option defaultValue='sc'> School C </option>
            </Input>
            <Input s={6} type='select' id="districtname_input" label="District Name" defaultValue={this.state.district_name} onChange={(evt) => this.extractVal("district_name", evt, "districtname_input")}>
              <option> Select the District Name </option>
              <option defaultValue='da'> District A </option>
              <option defaultValue='db'> District B </option>
              <option defaultValue='dc'> District C </option>
            </Input>
            <Input s={6} label="Parent First Name" validate defaultValue={this.state.parent_first_name} onChange={(evt) => this.extractVal("parent_first_name", evt, null)}/>
            <Input s={6} label="Parent Last Name" validate defaultValue={this.state.parent_last_name} onChange={(evt) => this.extractVal("parent_last_name", evt, null)}/>
            <Input type="email" label="Parent Email" s={12}  validate defaultValue={this.state.parent_email} onChange={(evt) => this.extractVal("parent_email", evt, null)}/>
            <Input s={6} label="Artwork Title" validate defaultValue={this.state.artwork_title} onChange={(evt) => this.extractVal("artwork_title", evt, null)}/>
            <Input s={6} type='select' id='artcategory_input' label="Artwork Category" validate defaultValue={this.state.artwork_category} onChange={(evt) => this.extractVal("artwork_category", evt, 'artcategory_input')}>
              <option> Select the Artwork Category </option>
              <option defaultValue='1st'> Radial Button </option>
              <option defaultValue='2nd'> Photography or Digital </option>
            </Input>
            <Input s={6} type='select' id='artmedium_input' label="Artwork Medium" validate defaultValue={this.state.artwork_medium} onChange={(evt) => this.extractVal("artwork_medium", evt, "artmedium_input")}>
              <option> Select the Artwork Medium </option>
              <option defaultValue='1st'> Watercolor </option>
              <option defaultValue='2nd'> Crayon </option>
            </Input>
        </Row>
    )
  }
}

export default StudentEntry
