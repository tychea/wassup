import React,{Component} from 'react';
import Register from './Register';
import Reset from './Reset';
import Login from './Login';

class Auth extends Component{
    constructor(props){
        super(props);
        this.state = {
            goToRegister: false,
            goToForgetPassword: false,
        }
    }
    switchToRegister = () => {
        this.setState({ goToRegister: !this.state.goToRegister });
      };
    
    switchToForgetPassword = () => {
        this.setState({ goToForgetPassword: !this.state.goToForgetPassword });
    };
    render(){
        let boxClass = ["formWrapper"];
        if (this.state.goToRegister) {
          boxClass.push("registerForm");
        }
        if (this.state.goToForgetPassword) {
          boxClass.push("forgetPasswordForm");
        }
        
        return(
            <div className="loginContainer">
                <div className="scence">
                    <div className={boxClass.join(" ")}>
                        <Reset switchToForgetPassword={this.switchToForgetPassword}  />
                        <Login switchToRegister={this.switchToRegister} switchToForgetPassword={this.switchToForgetPassword}/>
                        <Register switchToRegister={this.switchToRegister}  />
                    </div>
                </div>
            </div>
        )
    }
}

export default Auth;