import React, { Component } from "react";
import { faTimesCircle,faCheckCircle, faMeteor,faUserCheck,faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserProfileImage from '../../../api/file/UserProfileImage';
export default class UserProfile extends Component {
  constructor(props){
    super(props);
    this.state={
          fileId : '',
          userExist:''
    }
  }
  
  handleClick = () => {
    this.props.toggleUserProfile();
  };
  uploadIt=(e)=> {
  
    e.preventDefault();
    
    let self = this;
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];

      if (file) {
        let uploadInstance = UserProfileImage.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false)
        uploadInstance.on('start', function () {
          console.log('Starting');
        })//1

        uploadInstance.on('end', function (error, fileObj) {
          console.log('On end File Object: ', fileObj._id);

        })
        
        uploadInstance.on('uploaded', function (error, fileObj) {
            if(error){
                    
                console.log(error.reason);
               // self.setState({errorUpload:error.reason},()=>{console.log(self.state.errorUpload)});
           }else{
               Meteor.call('user.UpdateProfileLink',fileObj._id);
           }
        })

        // uploadInstance.on('error', function (error, fileObj) {
        //   console.log('Error during upload: ' + error);
          
        // });

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress)
          // Update our progress bar
        //   self.setState({
        //     progress: progress
        //   });
        });//run at upload progress

         uploadInstance.start(); // Must manually start the upload
        
      }
    }
  }
  handleEditProfile=(value)=>{
    switch(value){
        case "pfImage":
            this.props.userProfileLink==''?console.log('user No Profile'):console.log('user has Profile');
            this.refs['fileinput'].click();

            break;
          default:
            break;
    }

  }
render() {
  return (

   <div className="modal">
           
     <div className="modal_content heightProfile" >
     <a onClick={this.handleClick} className="closeAddFriend"> <FontAwesomeIcon icon={faTimesCircle} /> </a> 
       
            <div className="containerDisplay">
                <input type="file" id="fileinput" disabled={this.state.inProgress} hidden='hidden' ref="fileinput"
                        onChange={this.uploadIt}/>
                <img onClick={this.handleEditProfile.bind(this,"pfImage")} id="pfImage" style={{ width: "200px",height:"200px",margin: "10px" }} src={(this.props.userProfileLink=='')?"/image/logo2.png":UserProfileImage.findOne({_id: this.props.userProfileLink}).link()} alt="Logo"/>
            </div>
            <div  className='userProfileDisplay'>* First Name:  <span style={{textDecoration:'underline'}}>{" "+Meteor.user().firstname}<a onClick={this.handleEditProfile.bind(this,"pfFirstName")} id="pfFirstName"className="editUserProfile"> <FontAwesomeIcon icon={faTimesCircle} /> </a></span></div>
            <div className='userProfileDisplay'>* Last Name:  <span style={{textDecoration:'underline'}}>{" "+Meteor.user().lastname}<a onClick={this.handleEditProfile.bind(this,"pfLastName" )} id="pfLastName" className="editUserProfile"> <FontAwesomeIcon icon={faTimesCircle} /> </a></span></div>
            <div className='userProfileDisplay'>* Email:   <span style={{textDecoration:'underline'}}>{" "+Meteor.user().emails[0].address}</span></div>
            <div className='userProfileDisplay'>* Friend Count:   <span style={{textDecoration:'underline'}}>{" "+Meteor.user().friends.length}</span></div>

        
            
     </div>
     
   </div>
  );
 }
}