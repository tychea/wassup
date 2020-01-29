import React, { Component } from "react";
import { faTimesCircle,faCheckCircle, faMeteor,faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default class AddFriend extends Component {
  constructor(props){
    super(props);
    this.state={
          
    }
  }
  handleClick = () => {
    this.props.toggleAddFriend();
  };
  handleButtonAddFriend = ()=>{
    this.props.toggleButtonAddFriend();
    
  }
  handleSendFriendRequest=()=>{
    const friend = this.props.findFriend;
    console.log(friend);
    Meteor.call('user.updateRequestNotification',friend,(error)=>{
      if(error){
        Bert.alert({
          title: 'Request Already Send',
          message: error.reason,
          type: 'danger',
          style: 'growl-top-left'     
        });
      }else{
        Bert.alert({
          title: 'Success',
          message: 'Request Send',
          type: 'success',
          style: 'growl-top-left'     
        });
      }
      this.props.toggleButtonAddFriend();
    });
  }

render() {
  return (
   <div className="modal">
     <div className="modal_content" >
     
       <form onSubmit={this.props.handleFindFriend}>
          <a onClick={this.handleClick} className="closeAddFriend"> <FontAwesomeIcon icon={faTimesCircle} /> </a>
          <div className='friendEmail'>Please Input Your Friend Email</div>
          {this.props.buttonAddFriend?null:(
            
            
            <div className="containerDisplay">
              {/* <img style={{ width: "200px",background:"#2c3e50",height:"200px",margin: "10px" }} src="/image/logo2.png" alt="Logo"/> */}
              <input className="search-friend-email"  ref="addEmail" type="text" name=" " placeholder="Email" onChange={this.props.handleChangeInput.bind(this)}/>
              <a onClick={this.props.handleFindFriend} className="closeAddFriend"> <FontAwesomeIcon icon={faUserCheck} /> </a> 
            </div>)}
        </form>
        {this.props.buttonAddFriend ?
        
        (<div style={{width:'100%',textAlign:'center'}} >
            <div className="containerDisplay">
                <img style={{ width: "200px",background:"#2c3e50",height:"200px",margin: "10px" }} src="/image/logo2.png" alt="Logo"/>
            </div>
            <a onClick={this.handleSendFriendRequest} className="sendAddFriend"> <FontAwesomeIcon icon={faCheckCircle} /> </a> 
        
            <a onClick={this.handleButtonAddFriend} className="closeAddFriend"> <FontAwesomeIcon icon={faTimesCircle} /> </a> 
         </div>
        ): null}
     </div>
     
   </div>
  );
 }
}