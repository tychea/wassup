import React, { Component } from 'react';
import AddFriend from './popup/AddFriend';
import ReactDOM from 'react-dom';
import AppSideBar from './AppSidebar';
import Notification from './popup/Notification';
import UserProfile from './popup/UserProfile';
import ChatBox from './ChatBox';
import { array } from 'prop-types';
import FriendList from './FriendList';
import { faPaperPlane,faPaperclip,faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withTracker } from 'meteor/react-meteor-data';
import {Messages} from '../../api/message/messages';
import UserFiles from '../../api/file/UseFiles';
import UserProfileImage from '../../api/file/UserProfileImage';
 class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newFriend:'',
            addFriend:false,
            buttonAddFriend:false,
            buttonUserProfile:false,
            findFriend:{},
            notification:false,   
            selectedFriendId:'', 
            uploading: [],
            progress: 0,
            inProgress: false,
            errorUpload:'', 
            userProfileLink:{},      
        }
    }
    uploadFileClick(event){
        this.refs['fileinput'].click();
    }
    uploadIt=(e)=> {
        e.preventDefault();
    
        let self = this;
        if (e.currentTarget.files && e.currentTarget.files[0]) {
          // We upload only one file, in case
          // there was multiple files selected
          var file = e.currentTarget.files[0];
    
          if (file) {
            let uploadInstance = UserFiles.insert({
              file: file,
              meta:{
                messageId:this.state.selectedFriendId.messageId,
                senderId:Meteor.userId(),
              },
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
                    Bert.alert({
                        title: 'Error',
                        message: error.reason,
                        type: 'danger',
                        style: 'growl-top-left'     
                      });
                    // self.setState({errorUpload:error.reason},()=>{console.log(self.state.errorUpload)});
                }else{
                    const chatTextWithChatId = {chatText:fileObj._id,chatId:self.state.selectedFriendId.messageId,isFile:true};
                    Meteor.call('messages.sendChat',chatTextWithChatId);
                    console.log('uploaded: ', fileObj._id);

                }
            
    
              //Remove the filename from the upload box
            //   self.refs['fileinput'].value = '';
    
            //   Reset our state for the next file
            //   self.setState({
            //     uploading: [],
            //     progress: 0,
            //     inProgress: false
            //   });
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
    toggleAddFriend = () => {
        this.setState({addFriend: !this.state.addFriend,newFriend:''});
    };
    toggleButtonAddFriend = () => {
        this.setState({buttonAddFriend: !this.state.buttonAddFriend,newFriend:''});
        
    };

    handleChangeInput=(e)=>{
        const value = e.target.value;
        this.setState({newFriend:value});
    };

    handleSendMessage=(event)=>{
        event.preventDefault();
     
        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const chatTextWithChatId = {chatText:text,chatId:this.state.selectedFriendId.messageId,isFile:false};
        Meteor.call('messages.sendChat',chatTextWithChatId);
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    handleFindFriend=(e)=>{
        e.preventDefault();
              Meteor.call('user.findFriend', this.state.newFriend ,{ wait: true }, (err, result) => {
              if (err) {
                  Bert.alert({
                    title: 'Error',
                    message: err.reason,
                    type: 'danger',
                    style: 'growl-top-left'     
                  });
                
              } else {
                  this.setState({buttonAddFriend: !this.state.buttonAddFriend,findFriend:result});
                  console.log(this.state.findFriend)
                  
              }
          });
    }
    
    friendProfileClickHandler=(friend)=>{
        this.setState({selectedFriendId:friend});  

    }
    toggleNotification=()=>{
        this.setState({notification: !this.state.notification});
    }
    toggleUserProfile=()=>{
        this.setState({buttonUserProfile: !this.state.buttonUserProfile});
    };
    getLastChild=()=>{
        const lastChild =document.querySelector('.middleOfContent').lastElementChild;
        lastChild.scrollIntoView;
    }
    render() {     
        const findKey = ()=>{
            if(this.state.messageid.hasOwnProperty(this.state.message[1])){
              return  <h1>{this.state.messageid[message[1]][0].id}</h1>
            }
        }
     
       
        
        return (       
            <div className="main-container h-100 bg-secondary">
                {this.state.addFriend ? <AddFriend userProfileLink={Meteor.user().profileLink} findFriend={this.state.findFriend} toggleButtonAddFriend={this.toggleButtonAddFriend} buttonAddFriend={this.state.buttonAddFriend} handleChangeInput={this.handleChangeInput} handleFindFriend={this.handleFindFriend} handleAddFriend={this.handleAddFriend} toggleAddFriend={this.toggleAddFriend} /> : null}
                {this.state.notification?<Notification dataLoading={this.props.dataLoading} toggleNotification={this.toggleNotification}/>:null}
                {this.state.buttonUserProfile?(this.props.dataLoading?'':<UserProfile toggleUserProfile={this.toggleUserProfile} userProfileLink={Meteor.user().profileLink}/>):null}
                {/* <div className="sidebar ">   */}
                {this.props.dataLoading?'':
                    this.props.dataLoading3?'':<AppSideBar userProfileLink={Meteor.user().profileLink} toggleUserProfile={this.toggleUserProfile}  toggleNotification={this.toggleNotification} dataLoading={this.props.dataLoading} toggleAddFriend={this.toggleAddFriend} clicked={this.friendProfileClickHandler} />
                }
                {/* {this.props.dataLoading?'': <AppSideBar userProfileLink={Meteor.user().profileLink} toggleUserProfile={this.toggleUserProfile}  toggleNotification={this.toggleNotification} dataLoading={this.props.dataLoading} toggleAddFriend={this.toggleAddFriend} clicked={this.friendProfileClickHandler} />} */}
                
                {/* </div> */}
                <div className="content ">
                    <div className='topOfContent'>
                        <h1>{this.state.errorUpload}</h1>
                        { (this.state.selectedFriendId=='')?null:(
                        <div className='name'>{this.state.selectedFriendId.firstname +" "+ this.state.selectedFriendId.lastname}</div>)}
                        
                    </div>
                    <div className='middleOfContent'>
        
                            { (this.state.selectedFriendId=='')?null:(
                                 this.props.dataLoading2?'':(
                                        this.props.newMessages[this.state.selectedFriendId.messageId].map((message,index)=>{
                                            if(message.senderId==Meteor.userId()){
                                                return (<div key={index} className='chatBox sendChatToRight' >{message.isFile?
                                                    this.props.dataLoading3?'':(
                                                        this.props.files.map((file)=>{
                                                            if(file._id==message.messageText){
                                                                let link = UserFiles.findOne({_id: file._id}).link();
                                                                return (
                                                                <div>
                                                                    {(file.ext=='png'||file.ext=='jpg')?
                                                                    <div>
                                                                        <img style={{width:'150px',height:'200px'}} src={link}/>                                          
                                                                        <a href={link}  target="_blank" >
                                                                            <FontAwesomeIcon icon={faDownload} />              
                                                                        </a>
                                                                    </div>
                                                                    :
                                                                    <div style={{backgroundColor:"#2c3e50", color:'white'}}>
                                                                        {file.name}
                                                                        <a href={link}  target="_blank" >
                                                                            <FontAwesomeIcon icon={faDownload} />              
                                                                        </a>
                                                                    </div>}
                                                                </div>)
                                                                
                                                            }
                                                        })
                                                      
                                                    )
                                                    :<div style={{padding: '10px',borderRadius: '10px',backgroundColor:"#2c3e50", color:'white'}}>{message.messageText}</div>}</div>)
                                            }else{
                                                return (<div key={index}  className='chatBox' >{message.isFile?
                                                    this.props.dataLoading3?'':(
                                                        this.props.files.map((file)=>{
                                                            if(file._id==message.messageText){
                                                                let link = UserFiles.findOne({_id: file._id}).link();
                                                                return (
                                                                <div>
                                                                    {(file.ext=='png'||file.ext=='jpg')?
                                                                    <div>
                                                                        <img style={{width:'150px',height:'200px'}} src={link}/>                                          
                                                                        <a href={link}  target="_blank" >
                                                                            <FontAwesomeIcon icon={faDownload} />              
                                                                        </a>
                                                                    </div>
                                                                    :
                                                                    <div style={{backgroundColor:"#2c3e50", color:'white'}}>
                                                                        {file.name}
                                                                        <a href={link}  target="_blank" >
                                                                            <FontAwesomeIcon icon={faDownload} />              
                                                                        </a>
                                                                    </div>}
                                                                </div>)
                                                            }
                                                        })
                                                      
                                                    )
                                                    :<div style={{padding: '10px',borderRadius: '10px',backgroundColor:"slategrey", color:'white'}}>{message.messageText}</div>}</div>)
                                            }
                                            
                                    })  
                                
                                )  
                               )
                            }

                    </div>
                    
                        {/* {this.props.dataLoading3?'':console.log(this.props.files)} */}
                    <div className='bottomOfContent'>
                    {this.state.selectedFriendId==''?null:(
                    <form className="newMessage" onSubmit={this.handleSendMessage} >
                        <a onClick={this.uploadFileClick.bind(this)}className="send">
                            <FontAwesomeIcon icon={faPaperclip} />              
                        </a>
                        <input type="file" id="fileinput" disabled={this.state.inProgress} hidden='hidden' ref="fileinput"
                        onChange={this.uploadIt}/>
                      
                        <input className="messageBox"
                            type="text"
                            ref="textInput"
                            placeholder="enter your message"
                        />
                       <a onClick={this.handleSendMessage}className="send">
                            <FontAwesomeIcon icon={faPaperPlane} />              
                        </a>

                    </form>    
                    )} 
                    
                    </div>   
                </div>
            </div>   
        )
    }
}   

// export default App;

export default withTracker (()=>{
    var handle = Meteor.subscribe('user');
    var handle2 = Meteor.subscribe('messages');
    const handle3 = Meteor.subscribe('files.all');
    const handle4 = Meteor.subscribe('allUserProfile');
    const handle5= Meteor.subscribe('allFriendProfileLink');
    const userProfileImg = UserProfileImage.find({}).fetch;
    const files = UserFiles.find({}, {sort: {name: 1}}).fetch();
    const messages = Messages.find({}).fetch();
    const newMessages = {};
    messages.map((message)=>{
      newMessages[message._id]=message.message;
    })
     return { 
         user:Meteor.user(),
         newMessages,
         files,
         userProfileImg,
         handle5,
         dataLoading5:!handle5.ready()||!Meteor.user(),
         dataLoading4: !handle4.ready() || !Meteor.user(),
         dataLoading3: !handle3.ready() || !Meteor.user(),
         dataLoading2:!handle2.ready()||!Meteor.user(),
         dataLoading: !handle.ready() || !Meteor.user(), 
              
     };
 })(App);



