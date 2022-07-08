import React from 'react';
// import Firebase, { FirebaseContext } from '../Firebase/firebase';
// import { UserProvider } from '../Contexts/user.context';
// import { ProfileProvider } from '../Contexts/profile.context';
// import ChatsListComponent from '../Components/ChatsList/ChatsList.component';
// import NavigationComponent from '../Components/Header/Navigation.component';
// import ChatInputComponent from '../Components/ChatInput/ChatInput.component';

export const ChatsListPage = ({ location }: any) => {
  //set callback to hide topmost chat component
  return (
    <>chats list</>
    // <FirebaseContext.Consumer>
    //   {(firebase: Firebase) => {
    //     return (
    //       <UserProvider>
    //         <ProfileProvider>
    //           <NavigationComponent firebase={firebase} />
    //           <ChatInputComponent
    //             firebase={firebase}
    //             routeProps={location!.state}
    //           />
    //           <ChatsListComponent firebase={firebase} />
    //         </ProfileProvider>
    //       </UserProvider>
    //     );
    //   }}
    // </FirebaseContext.Consumer>
  );
};
