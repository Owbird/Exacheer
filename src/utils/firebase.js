import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, } from 'firebase/auth'
import { getFirestore, doc, setDoc, addDoc, getDoc, collection, Timestamp, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAbgyVL5_pIlt5vvXL4Mah6bP5GXxe0TA4",
    authDomain: "exacheer-c9099.firebaseapp.com",
    projectId: "exacheer-c9099",
    storageBucket: "exacheer-c9099.appspot.com",
    messagingSenderId: "93257928047",
    appId: "1:93257928047:web:ebafb7b80285db91252c9a",
    measurementId: "G-6YM40VT9RG"
};

const app = initializeApp(firebaseConfig);

const authentication = getAuth(app)

const database = getFirestore(app)

const storage = getStorage(app)

const userDataCollection = collection(database, "user data")
const questionsCollection = collection(database, "questions")
const banksCollection = collection(database, "banks")
const examsCollection = collection(database, "exams")
// const analytics = getAnalytics(app);


const authenticate = async ({ email, password }, isSignUP) => {

    const res = {}

    try {
        res['user'] = isSignUP
            ? await createUserWithEmailAndPassword(authentication, email, password)
            : await signInWithEmailAndPassword(authentication, email, password)
    } catch (error) {
        res['error'] = error.message.replace("Firebase:", "").replace("auth/", "")
    }

    return res

}

const uploadFile = async (value, id) => {
    let idUrl = ""
    const fileRef = ref(storage, `Examiner IDs/${id}`)

    // uploadBytesResumable(fileRef, value).then(() => {
    //     getDownloadURL(fileRef).then((url) => {
    //         idUrl = url
    //         console.log(idUrl, "from fire")
    //         return idUrl
    //     });
    // }).catch((err) => {
    //     console.log(err, "err")
    // })

    await uploadBytesResumable(fileRef, value);

    idUrl = await getDownloadURL(fileRef)


    return idUrl
}

const submitUserData = async (values) => {
    const userData = { ...values, "isVerified": false }
    delete userData['password']
    userData.userType = "examiner"

    await setDoc(doc(database, `/user data/${values.email}`), userData)

}

const getUserData = async (email) => {

    let data

    try {
        let docRef = await getDoc(doc(database, `/user data/${email}`))
        data = docRef.data()
    } catch (e) {
        console.log(e.message)
        data = { err: e.message }
    }
    // if (!docRef) {
    //     docRef = await getDoc(doc(database, `/user data/${email}`))
    // }
    console.log("get user data main fuync", data)
    return data

}

const saveBank = async (values) => {

    const bankData = { ...values }
    bankData['dateCreated'] = Timestamp.now()
    bankData['lastEdit'] = Timestamp.now()

    await setDoc(doc(database, `/${bankData.isExam ? 'exams' : 'banks'}/${bankData.id}`), bankData)
    // await setDoc(doc(database, `/banks/${bankData.id}/questions`), bankData)

}

const deleteData = async (path) => {
    await deleteDoc(doc(database, path))
}

const signOut = async () => await authentication.signOut()


export {
    authentication,
    database,
    questionsCollection,
    banksCollection,
    examsCollection,
    authenticate,
    submitUserData,
    getUserData,
    signOut,
    saveBank,
    deleteData,
    uploadFile
}