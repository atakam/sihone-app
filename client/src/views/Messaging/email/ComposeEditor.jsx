import React from "react";
import axios from "axios";

import Utils from "../../utils/Utils";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

import MemberSelect from '../../utils/MemberSelect.jsx'
import GroupSelect from '../../utils/GroupSelect.jsx'

import Cancel from "@material-ui/icons/Cancel";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Quill from "quill";

class ComposeEditor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      members: [],
      groups: [],
      specials: [],
      subject: '',

      snackMessage: '',
      openError: false,
      openSuccess: false,

      churchname: '',
      logo: '',
      emailfooter: '',
      emailContent: ''
    };
  }

  componentDidMount() {
    this.fetchSettings();

    this.quill = new Quill('#editor-container', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      placeholder: '',
      theme: 'snow'  // or 'bubble'
    });

    this.quill.on('text-change', function(delta) {
      this.setState({
        emailContent: this.quill.container.firstChild.innerHTML
      });
    }.bind(this));
  }

  handleInputChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  }

  handleEmailContentChange = (value) => {
    this.setState({ emailContent: value });
  }

  handleAddMember = (member) => {
    let members = this.state.members;
    members.push(member);
    this.setState({
      members: members
    });
  }

  handleRemoveMember = (member) => {
    let members = this.state.members;
    const index = members.indexOf(member);
    members.splice(index, 1);
    this.setState({
      members: members
    });
  }

  handleAddGroup = (group) => {
    let groups = this.state.groups;
    groups.push(group);
    this.setState({
      groups: groups
    });
  }

  handleRemoveGroup = (group) => {
    let groups = this.state.groups;
    const index = groups.indexOf(group);
    groups.splice(index, 1);
    this.setState({
      groups: groups
    });
  }

  handleAddSpecial = (special) => {
    let specials = this.state.specials;
    specials.push(special);
    this.setState({
      specials: specials
    });
  }

  handleRemoveSpecial = (special) => {
    let specials = this.state.specials;
    const index = specials.indexOf(special);
    specials.splice(index, 1);
    this.setState({
      specials: specials
    });
  }

  getRichTextEditor = () => {
    return (
      <div id="editor-container"/>
    );
  }

  reset = () => {
    this.setState({
      members: [],
      groups: [],
      specials: [],
      subject: '',
      emailContent: ''
    });
    this.quill.root.innerHTML = '';
  }

  closeNotification = () => {
    this.setState({
      openError: false,
      openSuccess: false
    });
  }

  handleSend = () => {
    const {
      churchname,
      emailfooter,
      subject,
      members,
      groups,
      specials,
      emailContent
    } = this.state;
    const memberids = members.map((member) => member.value);
    const groupids = groups.map((group) => group.value);
    const _specials = specials.map((special) => special.value);

    const website = window.location.protocol + '//' + window.location.host;
    const template = Utils.getEmailTemplates(churchname, subject, emailfooter, website, `${website}/settings/logo`)[0];
    const emailBody = template.before + emailContent + template.after;

    axios({
      method: 'post',
      url: '/email/new',
      data: {subject: subject, emailtext: emailBody, memberids, groupids, specials: _specials}
    })
    .then(function(response, body) {
      response.data.success && this.reset();
      this.setState({
        snackMessage: response.data.success ? 'Successfully sent.' : 'Message was not sent!',
        openSuccess: response.data.success,
        openError: !response.data.success
      });
    }.bind(this));
  }

  fetchSettings = () => {
    fetch('/settings/findAll')
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      this.setState({
        churchname: json.settings.churchname || Utils.DEFAULT_NAME,
        emailfooter: json.settings.emailfooter || Utils.DEFAULT_FOOTER,
        logo: json.settings.logo
      })
    })
    .catch(error => console.log('error', error));
  }

  handlePreview = () => {
    const {
      churchname,
      emailfooter,
      subject,
      emailContent
    } = this.state;
    const website = window.location.protocol + '//' + window.location.host;
    const template = Utils.getEmailTemplates(churchname, subject, emailfooter, website, `${website}/settings/logo`)[0];
    const emailPreview = template.before + emailContent + template.after;
    var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=500,top="+(window.height-400)+",left="+(window.width-840));
win.document.body.innerHTML = emailPreview;
  }

  render() {
    const predefinedGroups = Utils.getPredefinedGroups();
    const excludeSpecial = this.state.specials.map((special) => special.value);
    let modifiedPredinedGroups = predefinedGroups.map(pdfg => {
      if (excludeSpecial.indexOf(pdfg.value) < 0) {
        return {
          value: pdfg.value,
          label: pdfg.label,
        };
      }
      return null;
    });
    modifiedPredinedGroups = modifiedPredinedGroups.filter((obj) => obj );

    return (
      <div>
        <Snackbar
          message={this.state.snackMessage}
          close
          place="tc"
          color="danger"
          open={this.state.openError}
          closeNotification={this.closeNotification}
        />
        <Snackbar
          message={this.state.snackMessage}
          close
          place="tc"
          color="success"
          open={this.state.openSuccess}
          closeNotification={this.closeNotification}
        />
        <GridContainer>
          <GridItem xs={12} sm={5} md={4}>
            <TextField
              id="select-special"
              select
              label="Predefined Groups"
              value={''}
              onChange={(e) => this.handleAddSpecial(e.target.value)}
              margin="normal"
              fullWidth
            >
              {modifiedPredinedGroups.map(option => (
                <MenuItem key={option.value} value={{value: option.value, label: option.label}}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </GridItem>
          <GridItem xs={12} sm={5} md={4}>
            <MemberSelect
              placeholder="Members"
              value={''}
              onChange={this.handleAddMember}
              excludeMembers={this.state.members.map((member) => {
                return {id: member.value}
              })}
              emailOnly
            />
          </GridItem>
          <GridItem xs={12} sm={5} md={4}>
            <GroupSelect
              placeholder="Groups"
              value={''}
              onChange={this.handleAddGroup}
              emailOnly
              required
            />
          </GridItem>
          <div className="email-to">
            {
              this.state.specials.map((special, i) => {
                return (
                  <div key={i} className="member-to">
                    {special.label}
                    <Cancel onClick={() => this.handleRemoveSpecial(special)} />
                  </div>
                )
              })
            }
            {
              this.state.members.map((member, i) => {
                return (
                  <div key={i} className="member-to">
                    {member.label}
                    <Cancel onClick={() => this.handleRemoveMember(member)} />
                  </div>
                )
              })
            }
            {
              this.state.groups.map((group, i) => {
                return (
                  <div key={i} className="group-to">
                    {group.label}
                    <Cancel onClick={() => this.handleRemoveGroup(group)} />
                  </div>
                )
              })
            }
          </div>
          <div style={{ clear: 'both' }}/>
          <GridItem xs={12} sm={12} md={12}>
            <CustomInput
              labelText="Subject"
              id="subject"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                value: this.state.subject,
                onChange: (e) => this.handleInputChange(e, 'subject')
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            {this.getRichTextEditor()}
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Button
              color="warning"
              className='add-button create left'
              onClick={() => this.handlePreview()}>
              Preview
            </Button>
            <Button
              color="info"
              className='add-button create right'
              onClick={() => this.handleSend()}
              disabled={this.state.members.length === 0 && this.state.groups.length === 0 && this.state.specials.length === 0}>
              Send
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
export default ComposeEditor;
