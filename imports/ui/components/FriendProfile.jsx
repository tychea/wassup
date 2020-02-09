import React from 'react';
const styleText ={
    color:'red',
    fontSize: "12px"
}


const FriendProfile=(props)=>{
    (props.user.status=='online')? styleText.color='green':styleText.color='red';
    
    return (
        <div onClick={props.click} className='userProfile' >
            <img className='userImage' src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Avatar"></img>
            <div className='userName'>
                <div>{props.user.firstname + " " +props.user.lastname}</div>
                {/* <div style={styleText}>
                    {props.user.status}</div> */}
            </div>
        </div>
    );
}

export default FriendProfile;