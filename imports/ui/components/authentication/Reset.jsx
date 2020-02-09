import React,{ Component } from 'react';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default class Reset extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
          <form className="form left">
                <a onClick={this.props.switchToForgetPassword}>
                    <FontAwesomeIcon className="backButton" icon={faCheckCircle} />
                </a>
          </form>
        )
    }
}