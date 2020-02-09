import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {Messages} from '../../api/message/messages';
// import Users from './users';

if(Meteor.isServer) {

     Meteor.publish('user',function(){
        if (this.userId) {
            return Meteor.users.find({_id: this.userId},
                                    { fields: { firstname: 1,lastname:1, friends: 1,userRequestNotification:1,userReceiveNotification:1,profileLink:1 } });
        } 
        
    })
    Meteor.publish('allFriendProfileLink',function(){
        this.autorun(function (computation) {
          if(this.userId){
            var currentUser = Meteor.users.findOne(this.userId);
            const friendList = currentUser.friends;
            const profileLink =  [];
            friendList.map((friend)=>{
                profileLink.push(friend.id);
            })
            return Meteor.users.find({_id:{$in:profileLink}},
                { fields: { firstname: 1,lastname:1, friends: 1,userRequestNotification:1,userReceiveNotification:1,profileLink:1 } });
          }
          
          
        });
    })
    // Meteor.publish("allUserData", function () {
    //     return Meteor.users.find({}, {fields: { emails:1,username:1 }});
    // });
}
Meteor.methods({

    'user.register': (data) => {
        const userId=Accounts.createUser({
                    email: data.emails.toLowerCase(),
                    password: data.password,
        });
        if(userId){
            Meteor.users.update(userId, {
                $set: {
                        firstname:data.firstname,
                        lastname:data.lastname,
                        friends:[],
                        userRequestNotification:[],
                        userReceiveNotification:[],
                        profileLink:''
                      }
            });
//             const stampedLoginToken = Accounts._generateStampedLoginToken();
// Accounts._insertLoginToken(user._id, stampedLoginToken);
            var stampedLoginToken = Accounts._generateStampedLoginToken();
            Accounts._insertLoginToken(userId, stampedLoginToken);
            return stampedLoginToken;
        }


     
    },
    'user.updateRequestNotification':(user)=>{
        if (!Meteor.userId) {
            throw new Meteor.Error('not-authorized', '403 Forbbiden!');
        }
        const requestList = Meteor.user().userRequestNotification;       
        const receiveList = Meteor.user().userReceiveNotification;
        requestList.map((requestList)=>{
            if(requestList.email===user.emails[0].address){
                throw new Meteor.Error(101, "Your Request Already Send Waiting For Respond");
            }
        })
        receiveList.map((receiveList)=>{
            if(receiveList.email===user.emails[0].address){
                throw new Meteor.Error(101, user.emails[0].address +" Already Send You A Freind Request");
            }
        })
        //update current user
        Meteor.users.update(Meteor.userId(), { $push:{userRequestNotification:{'id':user._id,'firstname':user.firstname,'lastname':user.lastname,'email':user.emails[0].address,'status':'pending'}} });
        Meteor.users.update(user._id, { $push:{userReceiveNotification:{'id':Meteor.userId(),'firstname':Meteor.user().firstname,'lastname':Meteor.user().lastname,'email':Meteor.user().emails[0].address,'status':'pending'}} });
    },
    'user.sendEmailConfirmationCode':(email)=>{
        const lower = email.toLowerCase();
        const to= lower;
        const from='WassUpMeteor';
        const subject= "Meteor Email";
        const num =Math.floor(10000 + Math.random() * 90000);
        const text= `Welcome To WassUp\n\nHere Your Confirmation Code: ${num}`;
        Email.send({ to, from, subject, text });
        return num;
    },
    'user.UpdateProfileLink':(link)=>{
        Meteor.users.update(Meteor.userId(), {$set:{profileLink:link}});
        return 'success'
    },
    'user.findEmail':(email)=>{
            const lower = email.toLowerCase();
            const user = Meteor.users.findOne({"emails.0.address": lower});
            if(user){
                throw new Meteor.Error(007,'Your Register Email Already In Used');
            }

        
    },
    'user.findFriend':(data)=>{
        const lower = data.toLowerCase();
        const user = Meteor.users.findOne({"emails.0.address": lower},{ fields: { firstname: 1,lastname:1,emails:true,profileLink:1 } });
        let validUser = false;
        // check if email exist
        if(!user){
            throw new Meteor.Error(1000, 'User is not Exist');
            //check if find yourself
        }else if(user._id==Meteor.userId()){
            throw new Meteor.Error(1000, 'You Can Not Add YourSelf');     
        }else{
            validUser = true;
        }
        //check if already friend
        const friendList = Meteor.user().friends;       
        friendList.map((friend)=>{
            if(friend.email===lower){
                validUser=false;
                throw new Meteor.Error(403, "email Already Your Friend");
            }
        })
        if(validUser){
            return user;
        }   
    },

    'user.acceptFriend':(user)=>{
        if (!Meteor.userId) {
            throw new Meteor.Error('not-authorized', '403 Forbbiden!');
        }
        const Room = Messages.insert({
            message:[]
        });
        Meteor.users.update(user.id,         {$push:{friends:{'id':Meteor.userId(),'firstname':Meteor.user().firstname,'lastname':Meteor.user().lastname,'email':Meteor.user().emails[0].address,'messageId':Room,'status':'pending'}} });
        Meteor.users.update(user.id,{$pull:{'userRequestNotification':{id: Meteor.userId()}}});
        Meteor.users.update(Meteor.userId(), {$push:{friends:{'id':user.id,'firstname':user.firstname,'lastname':user.lastname,'email':user.email,'messageId':Room,'status':'pending'}}});
        Meteor.users.update(Meteor.userId(),{$pull:{'userReceiveNotification':{id: user.id}}});
        return 'success Add Friend';
    },
    'user.rejectFriend':(user)=>{
        if (!Meteor.userId) {
            throw new Meteor.Error('not-authorized', '403 Forbbiden!');
        }
        Meteor.users.update(user.id,{$pull:{'userRequestNotification':{id: Meteor.userId()}}});
        Meteor.users.update(Meteor.userId(),{$pull:{'userReceiveNotification':{id: user.id}}});
    }
});