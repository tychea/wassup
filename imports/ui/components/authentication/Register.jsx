import React,{Component} from 'react';
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
            }
        }
    }
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
            formErrors.confirmPassword = 
              value===user.password?"":"password miss match";
            break;
          default:
            break;
        }
        
        this.setState({ formErrors,  user  });

      };

    registerUser = event => {
        // prevents page from refreshing onSubmit
        event.preventDefault();
        if (formValid(this.state.formErrors)&&userNotEmpty(this.state.user)) {
          console.log(`\
                    --Submiting--
                    FirstName:${this.state.user.firstname}
                    LastName:${this.state.user.lastname}
                    Email: ${this.state.user.emails}
                    Password: ${this.state.user.password}
                `);
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
                message: result,
                type: 'success',
                style: 'growl-top-left'     
              });
              Meteor.call( 'sendVerificationLink', ( error, response ) => {
                if ( error ) {
                  Bert.alert( error.reason, 'danger' );
                } else {
                  Bert.alert( 'Welcome!', 'success' );
                }
              });
                // Meteor.loginWithPassword(this.state.user.emails, this.state.user.password);
              // ReactDOM.findDOMNode(this.refs.textInput).value = '';
            }
          })
        }
        
    };

    render(){
        const isEnable=formValid(this.state.formErrors)&&userNotEmpty(this.state.user);
       
        return(
            <form onSubmit={this.registerUser}  className="form right">
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
            <div className="okBackWrapper">
              <button 
                  disabled={!isEnable}
                  id='registerButton'
                  className={`button ${ isEnable? "" : "disableButton"}`}
                  type="submit">
                  OK
              </button>
            </div>
            <a onClick={this.props.switchToRegister}>
                <FontAwesomeIcon className="backButton" icon={faBackspace} />
            </a>
          </form>
        )
    }

}