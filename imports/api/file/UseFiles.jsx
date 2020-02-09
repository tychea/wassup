import { Meteor } from 'meteor/meteor';
const UserFiles = new FilesCollection({
    storagePath: 'assets/app/uploads/UserFiles',
    downloadRoute: '/files/UserFiles',
    collectionName: 'UserFiles',
    permissions: 0o755,
    allowClientCode: false,
    cacheControl: 'public, max-age=31536000',
    // Read more about cacheControl: https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers
    onbeforeunloadMessage() {
      return 'Upload is still in progress! Upload will be aborted if you leave this page!';
    },
    onBeforeUpload(file) {
      // Allow upload files under 10MB, and only in png/jpg/jpeg formats
      // Note: You should never trust to extension and mime-type here
      // as this data comes from client and can be easily substitute
      // to check file's "magic-numbers" use `mmmagic` or `file-type` package
      // real extension and mime-type can be checked on client (untrusted side)
      // and on server at `onAfterUpload` hook (trusted side)
      if (file.size > 10485760 ) {
        return 'file size cannot bigger than 10MB';
      }else if( !/png|jpe?g|pdf/i.test(file.ext)){
        return 'unsupport file type (support only png,jpg,pdf format)';
      }else{
        return true;
      }
      
    },
    downloadCallback(fileObj) {
      if (this.params.query.download == 'true') {
        // Increment downloads counter
        UserFiles.update(fileObj._id, {$inc: {'meta.downloads': 1}});
      } 
      // Must return true to continue download
      return true;
    }
  });

// if (Meteor.isClient) {
//     Meteor.subscribe('files.images.all');
// }
if (Meteor.isServer) {
    Meteor.publish('files.all', function () {
      this.autorun(function (computation) {
        if(this.userId){
          var currentUser = Meteor.users.findOne(this.userId);
          const friendList = currentUser.friends;
          const friendMessageId =  [];
          friendList.map((friend)=>{
              friendMessageId.push(friend.messageId);
          })
          return UserFiles.find({'meta.messageId':{$in:friendMessageId}}).cursor;
          // return UserFiles.find({'meta.messageId':'k2KDPWaZr5rpm5sks' }).cursor;
        }
        
        
      });
    
    });
  
}

Meteor.methods({

    'RemoveFile'(id) {
       
        UserFiles.remove({_id: id}, function (error) {
            if (error) {
              console.error("File wasn't removed, error: " + error.reason)
            } else {
              console.info("File successfully removed");
            }
        });

    },
    
});
  // Export FilesCollection instance, so it can be imported in other files
  export default UserFiles;