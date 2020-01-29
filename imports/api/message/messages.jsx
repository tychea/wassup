import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo'

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
    Meteor.publish('messages',function(){
      this.autorun(function (computation) {
        if(this.userId){
          var currentUser = Meteor.users.findOne(this.userId);
          const friendList = currentUser.friends;
          const friendMessageId =  [];
          friendList.map((friend)=>{
              friendMessageId.push(friend.messageId);
          })
          return Messages.find({_id:{$in:friendMessageId}});
        }
        
        
      });
  })
}

Meteor.methods({

  'messages.sendChat':(chatRoomAndText)=>{
    if (!Meteor.userId) {
      throw new Meteor.Error('not-authorized', '403 Forbbiden!');
    }
    Messages.update(chatRoomAndText.chatId,{$push:{message:{'senderId':Meteor.userId(),'messageText':chatRoomAndText.chatText,'isFile':chatRoomAndText.isFile,'createdAt':new Date()}}});
  },
  'messages.findBySenderId': (receiverId) => {
      // const ownerId = Meteor.userId;
      const senderId ='007';
      return Messages.find({
          $or: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
          ]
      }).fetch();
  },
  'messages.sendMessage':(userMessage)=>{
      
  }
});
// export default Messages;
