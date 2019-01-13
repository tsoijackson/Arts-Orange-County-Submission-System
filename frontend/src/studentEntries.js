import React, { Component } from 'react';
import {Link,Route,Switch} from 'react-router-dom';
import {Button, Icon, Row, Input, Col, Autocomplete} from 'react-materialize';
import Api from './Api';
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
      artwork_votes: 0,

      schools: {},
      display_school: {},

      submitterDisabled: this.props.submitterGlobalSchool,
    }
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
      this.extractSchools()
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
        artwork_votes: tempVal["artwork_votes"],

        schools: {},
        display_school: {}
      })
    }
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
          let school_dict1 = {}
          for (var school in this.state.schools) {
            school_dict1[school] = null
          }
          this.setState({display_school:school_dict1}, function(){
            console.log(this.state.display_school)
          })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  extractVal = (stateVar, event, id) => {
    console.log(this.props.globalSchool)
    if (this.props.globalSchool === "" || typeof this.props.globalSchool == 'undefined') {
      document.getElementById("student_schoolinput").disabled = false;
      document.getElementById("student_schoolinput").value = "N/A";
    } else {
      document.getElementById("student_schoolinput").disabled = true;
    }

    if (id !== null) {
      this.setState({[stateVar]: $("#"+id).val()}, function(){
        this.pushApplicantDataHelper()
      })
    }
    else if (stateVar === "school_name") {
      this.setState({[stateVar]: event}, function() {
        this.pushApplicantDataHelper()
      });
    }
    else {
      this.setState({[stateVar]: event.target.value.toLowerCase()}, function() {
        this.pushApplicantDataHelper()
      });
    }
  }

  // when the data is moved to the register form
  pushApplicantDataHelper = () => {
    let current_school = this.state.school_name
    this.setState({
      currentID: this.props.id,
    })
    var tempDict = {}
    tempDict["artist_first_name"] = this.state.artist_first_name
    tempDict["artist_last_name"] = this.state.artist_last_name
    tempDict["district_name"] = this.state.schools[current_school]
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

  render() {
    return (
          <Row id="student-entries-wrapper">
            <Input s={6} label="First Name" validate defaultValue={this.state.artist_first_name} onBlur={(evt) => this.extractVal("artist_first_name", evt, null)}/>
            <Input s={6} label="Last Name" validate defaultValue={this.state.artist_last_name} onBlur={(evt) => this.extractVal("artist_last_name", evt, null)}/>
            <Input s={6} validate type='select' id="schooltype_input" label="School Type" validate defaultValue={this.state.school_type} onChange={(evt) => this.extractVal("school_type", evt, "schooltype_input")}>
              <option> Select the Student School Type </option>
              <option defaultValue='private'> Private </option>
              <option defaultValue='public'> Public </option>
            </Input>
            <Input s={6} validate type='select' id="studentgrade_input" label="Student Grade Level" validate defaultValue={this.state.grade} onChange={(evt) => this.extractVal("grade", evt, "studentgrade_input")}>
              <option> Select the Student Grade </option>
              <option defaultValue="pk"> Pre Kindergarten </option>
              <option defaultValue="tk"> Transitional Kindergarten </option>
              <option defaultValue="jk"> Junior Kindergarten </option>
              <option defaultValue="k"> Kindergarten </option>
              <option defaultValue="1"> 1st Grade </option>
              <option defaultValue="2"> 2nd Grade </option>
              <option defaultValue="3"> 3rd Grade </option>
              <option defaultValue="4"> 4th Grade </option>
              <option defaultValue="5"> 5th Grade </option>
              <option defaultValue="6"> 6th Grade </option>
              <option defaultValue="7"> 7th Grade </option>
              <option defaultValue="8"> 8th Grade </option>
              <option defaultValue="9"> 9th Grade </option>
              <option defaultValue="10"> 10th Grade </option>
              <option defaultValue="11"> 11th Grade </option>
              <option defaultValue="12"> 12th Grade </option>
            </Input>
            <Autocomplete s={12} id="student_schoolinput" title="School" value={this.state.school_name} onAutocomplete={(value) => this.extractVal("school_name", value, null) }
              data={this.state.display_school}
            >
            </Autocomplete>
            <Input s={6} label="Parent First Name" validate defaultValue={this.state.parent_first_name} onBlur={(evt) => this.extractVal("parent_first_name", evt, null)}/>
            <Input s={6} label="Parent Last Name" validate defaultValue={this.state.parent_last_name} onBlur={(evt) => this.extractVal("parent_last_name", evt, null)}/>
            <Input s={12} label="Artwork Title" validate defaultValue={this.state.artwork_title} onBlur={(evt) => this.extractVal("artwork_title", evt, null)}/>
            <Input s={6} type='select' id='artcategory_input' label="Artwork Category" defaultValue={this.state.artwork_category} onChange={(evt) => this.extractVal("artwork_category", evt, 'artcategory_input')}>
              <option> Select the Artwork Category </option>
              <option defaultValue='photography'> Photography </option>
              <option defaultValue='digital'> Digital </option>
              <option defaultValue='traditional2D'> Traditional 2D </option>
            </Input>
            <Input s={6} type='select' id='artmedium_input' label="Artwork Medium" defaultValue={this.state.artwork_medium} onChange={(evt) => this.extractVal("artwork_medium", evt, "artmedium_input")}>
              <option> Select the Artwork Medium </option>
              <option defaultValue='marker'> Marker </option>
              <option defaultValue='waterColor'> Water Color </option>
              <option defaultValue='oilPastel'> Oil Pastel </option>
              <option defaultValue='pencil'> Pencil </option>
              <option defaultValue='acrylicPaint'> Acrylic Paint </option>
            </Input>
        </Row>
    )
  }
}

export default StudentEntry
