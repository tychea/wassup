import React,{Component} from 'react';
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const formValid = formErros => {
    let valid = true;
    Object.values(formErros).forEach(
      error => {
      //   error.length > 0 && (valid = false);
          if(error.length>0){
              valid = false;
          }
      }
    );
    return valid;
  };

const userNotEmpty = user => {
      return (user.firstname.length>0&&user.lastname.length>0&&user.emails.length>0&&user.password.length>0&&user.confirmPassword.length>0);
};



export default class Register extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            user: {
                firstname:"",
                lastname:"",
                emails: "",
                password: "",
                confirmPassword: ""
            },
            formErrors: {
                firstname:"",
                lastname:"",
                emails: "",
                password: "",
                confirmPassword: ""
            },
            submitErrors:{
                emails:""
            },
        }
    }
    registerUser= (event)=>{
      // prevents page from refreshing onSubmit
      event.preventDefault();

          Meteor.call('user.register',this.state.user,(error,result)=>{
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
      
      
      
    };
    handleChangeInput = e => {
      
        e.preventDefault();
  
        const { id, value } = e.target;
        let formErrors = this.state.formErrors;
        let user = {...this.state.user, [id]: value};
        switch (id) {
          case "firstname":
            formErrors.firstname =  value.length < 2 ? "minimun 2 charactor required" : "";
            break;
          case "lastname":
            formErrors.lastname =  value.length < 2 ? "minimun 2 charactor required" : "";
          break;
          case "emails":
            formErrors.emails = validEmailRegex.test(value)
              ? ""
              : "Invalid Email Address";
            break;
          case "password":
            formErrors.password =
              value.length < 8 ? "minimun 8 charactor required" : "";
            break;
          case "confirmPassword":
            formErrors.confirmPassword =
              value.length < 8 ? "minimun 8 charactor required" : "";   
            break;
          default:
            break;
        }
        
        this.setState({ formErrors,  user  },()=>{console.log(this.state.user)});

      };


    render(){
        const isEnable=formValid(this.state.formErrors)&&userNotEmpty(this.state.user)&&(this.state.user.password===this.state.user.confirmPassword);
        
        return(
  
            <div className="form right">
            <form onSubmit={this.registerUser.bind(this)}>
            <h4 style={{ textAlign: "center" }}>Register New Account</h4>
            <div className="field ">
              <FontAwesomeIcon className="icon" icon={faUserTie} />
              <input
                onChange={this.handleChangeInput}
                className="input"
                id="firstname"
                type="text"
                placeholder="firstname"
                autoComplete="off"              
              />
            </div>
            {this.state.formErrors.firstname.length > 0 && (
              <span className="error">{this.state.formErrors.firstname}</span>
            )}
            <div className="field ">
              <FontAwesomeIcon className="icon" icon={faUserTie} />
              <input
                onChange={this.handleChangeInput}
                className="input"
                id="lastname"
                type="text"
                placeholder="lastname"
                autoComplete="off"              
              />
            </div>
            {this.state.formErrors.lastname.length > 0 && (
              <span className="error">{this.state.formErrors.lastname}</span>
            )}
            <div className="field ">
              <FontAwesomeIcon className="icon" icon={faAt} />
              <input
                onChange={this.handleChangeInput}
                className="input"
                id="emails"
                type='email'
                placeholder="Email"
                autoComplete="off"
             
              />
            </div>
            {this.state.formErrors.emails.length > 0 && (
              <span className="error">{this.state.formErrors.emails}</span>
            )}
            {this.state.submitErrors.emails.length > 0 && (
              <span className="error">{this.state.submitErrors.emails}</span>
            )}
            <div className="field ">
              <FontAwesomeIcon className="icon" icon={faKey} />
              <input
                onChange={this.handleChangeInput}
                className="input"
                id="password"
                type="password"
                placeholder="Password"
        
              />
            </div>
            {this.state.formErrors.password.length > 0 && (
              <span className="error">{this.state.formErrors.password}</span>
            )}
            <div className="field ">
              <FontAwesomeIcon className="icon" icon={faKey} />
              <input
                onChange={this.handleChangeInput}
                className="input"
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
     
              />
            </div>
            {this.state.formErrors.confirmPassword.length > 0 && (
              <span className="error">{this.state.formErrors.confirmPassword}</span>
            )}
            {
              (formValid(this.state.formErrors)&&userNotEmpty(this.state.user))?
              ((this.state.user.password!=this.state.user.confirmPassword)?
              <span className="error">Password Miss Match</span>:null):null
            }
            <div className="okBackWrapper">
              <button 
                  type='submit'
                  disabled={!isEnable}
                  onClick={this.registerUser}
                  id='registerButton'
                  className={`button ${ isEnable? "" : "disableButton"}`}
                  >
                  OK

              </button>
            </div>
            </form>
            <a onClick={this.props.switchToRegister}>
                <FontAwesomeIcon className="backButton" icon={faBackspace} />
            </a>
          </div>
        )
    }

}