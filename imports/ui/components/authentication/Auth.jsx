import React,{Component} from 'react';
import Register from './Register';
import Reset from './Reset';
import Login from './Login';
import ConfirmEmail from './ConfirmEmail';
class Auth extends Component{
    constructor(props){
        super(props);
        this.state = {
            goToRegister: false,
            goToForgetPassword: false,
            goToConfirmEmail:false,
            user:{
                firstname:"",
                lastname:"",
                emails: "",
                password: "",
            },
            confirmationCode:0,
        }
    }
    switchToRegister = () => {
        this.setState({ goToRegister: !this.state.goToRegister });
      };
    
    switchToForgetPassword = () => {
        this.setState({ goToForgetPassword: !this.state.goToForgetPassword });
    };
    switchToConfirmEmail=(confirmUser)=>{
        if(confirmUser!=null){
            Meteor.call('user.findEmail', confirmUser.emails,(error)=>{
                if(error){
                    Bert.alert({
                        title: 'Error',
                        message: error.reason,
                        type: 'danger',
                        style: 'growl-top-left'     
                    });
                }else{
                    Meteor.call('user.sendEmailConfirmationCode',confirmUser.emails,(error,result)=>{
                        const user = {...this.state.user}
                        user.firstname = confirmUser.firstname;
                        user.lastname = confirmUser.lastname;
                        user.emails = confirmUser.emails;
                        user.password = confirmUser.password;
                        this.setState({ goToConfirmEmail: !this.state.goToConfirmEmail,user,confirmationCode:result });
                    });
                }
            })
    }
        
    }
    render(){
        let boxClass = ["formWrapper"];
        if (this.state.goToRegister) {
          boxClass.push("registerForm");
        }
        if (this.state.goToForgetPassword) {
          boxClass.push("forgetPasswordForm");
        }
        if (this.state.goToConfirmEmail) {
            boxClass.push("confirmEmailForm");
          }
        
        return(
            <div className="loginContainer">
                <div className="scence">
                    <div className={boxClass.join(" ")}>
                        <Reset switchToForgetPassword={this.switchToForgetPassword}  />
                        <Login switchToRegister={this.switchToRegister} switchToForgetPassword={this.switchToForgetPassword}/>
                        <Register  switchToRegister={this.switchToRegister}  switchToConfirmEmail={this.switchToConfirmEmail}/>
                        <ConfirmEmail confirmCode={this.state.confirmationCode} confirmUser={this.state.user} switchToConfirmEmail={this.switchToConfirmEmail} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Auth;