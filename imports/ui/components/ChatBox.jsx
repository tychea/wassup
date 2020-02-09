import React, { Component } from 'react';

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
            <div className='chatBox'>
               
               hi
               {console.log(this.props.friendId+'_'+this.props.userId)}
            </div>
        )
     }
}