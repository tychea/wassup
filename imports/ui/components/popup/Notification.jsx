import React, { Component } from "react";
import { faTimesCircle,faHandshake,faMailBulk,faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {Messages} from '../../api/message/messages';
export default class Notification extends Component {
  constructor(props){
    super(props);
    this.state={
          request:false,
          receive:true
    }
  }
 
  toggleRequest=()=>{
    this.setState({request:true,receive:false})
  }
  toggleReceive=()=>{
    this.setState({request:false,receive:true})
  }
  handleAccept(user){
    Meteor.call('user.acceptFriend',user,(error,result)=>{
      if(error){
            console.log(error);   
      }else{
            console.log(result)
          }
      })   
  }
  handleDecline(id){
    Meteor.call('user.rejectFriend',id,(error)=>{
      console.log(error);
    })
   
  }
  render() {
    return (
     <div className="modal">
       <div className="notification_content">
           <div style={{display:'flex',justifyContent:'flex-start',marginBottom: '3px',position:'relative'}}>
            {this.state.receive?  <div className='pointerReceive'></div>:<div className='pointerSend'></div>}
              <a onClick={this.toggleReceive} className="requestReceive"> <FontAwesomeIcon icon={faHandshake} /> <small>Request Receive</small> </a>
              <a style={{marginLeft: '20px'}} onClick={this.toggleRequest} className="requestReceive"> <FontAwesomeIcon icon={faMailBulk} /> <small>Request Send</small></a> 
              <a onClick={this.props.toggleNotification} className="closeNotification"> <FontAwesomeIcon icon={faTimesCircle} /> </a>
           </div>
           <div style={{height:'100%',overflow: 'hidden'}} >
           {this.state.receive?(
            <ul className="ulNotification">
              {this.props.dataLoading ? "" :   
                ( Meteor.user().userReceiveNotification.map((user)=>{
                        return (
                              <li key={user.id}>
                                  <div>{user.name} ({user.email})</div>
                                  <div style={{textAlign:'right'}}>
                                      <a onClick={this.handleAccept.bind(this,user)} className="acceptDecline"> <FontAwesomeIcon icon={faCheckCircle} />Accept </a>
                                      <a onClick={this.handleDecline.bind(this,user)} className="acceptDecline"> <FontAwesomeIcon icon={faTimesCircle} />Decline </a>
                                  </div>
                              </li>
                              )})
                  )}          
                   
                    {/* <li>
                       <div>Steven (Steven@gmail.com)</div>
                        <div style={{textAlign:'right'}}>
                            <a onClick={this.props.toggleNotification} className="acceptDecline"> <FontAwesomeIcon icon={faCheckCircle} />Accept </a>
                            <a onClick={this.props.toggleNotification} className="acceptDecline"> <FontAwesomeIcon icon={faTimesCircle} />Decline </a>
                        </div>
                    </li> */}
                </ul>
               ):(
              <ul className="ulNotification">
                 {this.props.dataLoading ? "" :   
                   ( Meteor.user().userRequestNotification.map((user)=>{
                        return (
                                <li key={user.id}>
                                  <div>{user.name} ({user.email})</div>
                                  <div style={{textAlign:'right'}}>status : {user.status}</div>
                                </li>
                              )})
                  )} 
                </ul>
              )}      
           </div>
           
          
           
       </div>
       
     </div>
    );
   }
  }