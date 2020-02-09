import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../imports/api/user/methods';
import '../imports/api/user/users';
import '../imports/api/message/messages';
import '../imports/api/file/UseFiles';
import '../imports/api/file/UserProfileImage';
Meteor.startup(() => {
    // process.env.MAIL_URL="smtps://wassuptychea%40gmail.com:ty067660688@smtp.gmail.com:465/"; 
    // console.log(process.env.MAIL_URL);
    // Accounts.config({
    //     sendVerificationEmail:true,
    // });
    // Validate username, sending a specific error message on failure.
});
