import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import { faUserTie,faBackspace} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class ConfrimEmail extends Component {
	constructor(props) { 
		super(props);
		this.state = {
            enterCode:0,
            email:'',
            password:'',
		};
  }
  registerUser (event){
    // prevents page from refreshing onSubmit
    event.preventDefault();
    if(this.state.enterCode!=this.props.confirmCode){
        Bert.alert({
            title: 'Incorrect Code',
            message: 'Please Check Your Email Again',
            type: 'danger',
            style: 'growl-top-left'     
          });
    }else{
        Meteor.call('user.register',this.props.confirmUser,(error,result)=>{
        if(error){
          Bert.alert({
            title: 'Error',
            message: error.reason,
            type: 'danger',
            style: 'growl-top-left'     
          });
        }else{
          Bert.alert({
            title: 'Cogration',
            message: 'You Have Success Register',
            type: 'success',
            style: 'growl-top-left'     
          });
           Meteor.loginWithToken(result.token);
         }

      })
    
    }
    
    
};
    changeValue=(e)=>{   
        this.setState({enterCode:e.target.value});
    }
 
  render() {

    return (        
            <div className="form back">
            <h4 style={{ textAlign: "center" }}>Confirm Your Email</h4>
            <h6 style={{ textAlign: "center", marginTop: '15px'}}>Please Check Your Email Address For Confirmation Code</h6>
            <form onSubmit={this.registerUser.bind(this)}>
                <div className="field ">
                <FontAwesomeIcon className="icon" icon={faUserTie} />
                <input
                    onChange={this.changeValue}
                    className="input"
                    type="number"
                    placeholder="Enter Your Code Here"
                    autoComplete="off"              
                />
                </div>
                <button type="submit" className="button" >
                        Register
                </button>
            </form>
            
                <a onClick={this.props.switchToConfirmEmail}>
                    <FontAwesomeIcon className="backButton" icon={faBackspace} />
                </a>
             
            </div>
    );
  }
}