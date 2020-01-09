import React, { useState, useEffect } from "react";
import "rbx/index.css";
import { Button, Container, Title, Message } from "rbx";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import CourseList from './components/CourseList';
import {addScheduleTimes} from './components/CourseList';

const firebaseConfig = {
  apiKey: "AIzaSyAvalOVhldaw6RCJNKCP8vXVgqzj8YaWbs",
  authDomain: "scheduler-23edc.firebaseapp.com",
  databaseURL: "https://scheduler-23edc.firebaseio.com",
  projectId: "scheduler-23edc",
  storageBucket: "scheduler-23edc.appspot.com",
  messagingSenderId: "427751886278",
  appId: "1:427751886278:web:b06b87a67c5ce0608236c7"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database().ref();

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Banner = ({ user, title }) => (
  <React.Fragment>
    {user ? <Welcome user={user} /> : <SignIn />}
    <Title>{title || "[loading...]"}</Title>
  </React.Fragment>
);

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
);

const App = () => {
  const [schedule, setSchedule] = useState({ title: "", courses: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on("value", handleData, error => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <Container>
      <Banner title={schedule.title} user={user} />
      <CourseList courses={schedule.courses} user={user} />
    </Container>
  );
};

export default App;