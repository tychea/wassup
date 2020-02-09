import React,{Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { faCommentDots, faUserPlus,faPhoneAlt,faUserCog,faSignOutAlt,faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FriendProfile from './FriendProfile';
import UserProfileImage from '../../api/file/UserProfileImage';
class AppSideBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            
        <div className="sidebar" >         
            
            <div className='userProfile'>
                <img className='userImage' src={(this.props.userProfileLink=='')?"/image/logo2.png":
                UserProfileImage.findOne({_id: this.props.userProfileLink})==undefined?'':UserProfileImage.findOne({_id: this.props.userProfileLink}).link()
            } alt="Logo"/>
               
                <div className='userName'>
                    {this.props.dataLoading ? "" :   <div> { Meteor.user().firstname +" "+ Meteor.user().lastname}</div>}
                </div>
                <a onClick={this.props.toggleNotification} className="anchorButtonTop">
                            <FontAwesomeIcon icon={faBell} />              
                </a>
            </div>

            {/* <div className='search-box'>
                <input className="search-txt" type="text" name=" " placeholder="Search"/>
            </div> */}
            <div className="buttonClickContent">
                {
                     this.props.dataLoading ? "" :   
                   ( Meteor.user().friends.map((friend,index)=>{
                        return (
                            <FriendProfile  click={this.props.clicked.bind(this,friend)} key={friend.id} user={friend}/>
                       )
                    })
                   )
                }

            </div>
            <div className="menuButton">
                    <a onClick={this.props.toggleAddFriend}  className="anchorButton" >
                        <FontAwesomeIcon icon={faUserPlus} />
                    </a>
                    <a onClick={this.props.toggleUserProfile} className="anchorButton">
                        <FontAwesomeIcon icon={faUserCog} />
                    </a>
                    <a onClick={()=>{Meteor.logout()}} className="anchorButton">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </a>
            </div>
                
            
        </div>
        )
    }
}

export default AppSideBar;