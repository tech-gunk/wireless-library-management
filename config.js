import * as firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyAiUGwiOSnvBi4_i_vD4qpFfTZkJA3Fpmg",
  authDomain: "tech-gunks-wily.firebaseapp.com",
  projectId: "tech-gunks-wily",
  storageBucket: "tech-gunks-wily.appspot.com",
  messagingSenderId: "605616919412",
  appId: "1:605616919412:web:55914c7e7bd1bde3765221"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();