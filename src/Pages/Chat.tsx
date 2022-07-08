import React from 'react';
// import Firebase, { FirebaseContext } from '../Firebase/firebase';
// import { UserProvider } from '../Contexts/user.context';
// import { ProfileProvider } from '../Contexts/profile.context';
// import ChatInputComponent from '../Components/ChatInput/ChatInput.component';
// import { MsgNotificationProvider } from '../Contexts/messageNotification.context';
// import NavigationComponent from '../Components/Header/Navigation.component';

export const ChatPage = ({ location }: any) => {
  return (
    <>chat</>
    // <FirebaseContext.Consumer>
    //   {(firebase: Firebase) => {
    //     return (
    //       <UserProvider>
    //         <ProfileProvider>
    //           <MsgNotificationProvider firebase={firebase}>
    //             <NavigationComponent firebase={firebase} />
    //             <ChatInputComponent
    //               firebase={firebase}
    //               routeProps={location!.state}
    //             />
    //           </MsgNotificationProvider>
    //         </ProfileProvider>
    //       </UserProvider>
    //     );
    //   }}
    // </FirebaseContext.Consumer>
  );
};
