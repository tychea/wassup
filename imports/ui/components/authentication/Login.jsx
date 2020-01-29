import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Login extends Component {
	constructor(props) { 
		super(props);
		this.state = {
      email:'',
      password:'',
		};
  }
  handleChange(event) {
    const {id,value}=event.target;
    // this.setState({value: event.target.value});
    switch(id){
      case 'emailLogin':
        this.setState({email:value},()=>{
        });
      break;
      case 'passwordLogin':
        this.setState({password:value},()=>{
        });
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    Meteor.loginWithPassword(this.state.email, this.state.password, (err) => {
			console.log('Login callback', err);
			if (err) {
				this.setState({error: err.reason});
			} else {
				this.setState({error: ''});
			}
		});
  }
  render() {

    return (
            <form onSubmit={this.handleSubmit.bind(this)} className="form front">
              <div className="logoWrapper">
                <img
                  style={{ width: "200px" }}
                  src="/image/logo2.png"
                  alt="Logo"
                />
                <h3>Welcome Back</h3>
              </div>
              <div className="field ">
                <FontAwesomeIcon className="icon" icon={faAt} />
                <input
                  className="input"
                  id='emailLogin'
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="field ">
                <FontAwesomeIcon className="icon" icon={faKey} />
                <input
                  className="input"
                  id = 'passwordLogin'
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <button type='submit' className="button" id="submit">
                LOGIN
              </button>
              <div className="small">
                <a onClick={this.props.switchToForgetPassword}>Forget Password?</a>
                <a onClick={this.props.switchToRegister}>Register Now</a>
              </div>
            </form>
    );
  }
}