import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
class FriendList extends Component{
    constructor(props){
        super(props);
    }

    renderlist(){
            return Meteor.user().friends.map(friend=>{
                return(
                    <div>
                        <h1>{friend.name}</h1>
                    </div>
                )
            })
    }

    render(){
        return(       
            <div>
                {this.props.dataLoading ? "nothing" :  this.renderlist()}
               
            </div> 
        )
    }
}
export default withTracker (()=>{
   var handle = Meteor.subscribe('user');
    return { 
        user:Meteor.user(),
        dataLoading: !handle.ready() || !Meteor.user(),    
    };
})(FriendList);
