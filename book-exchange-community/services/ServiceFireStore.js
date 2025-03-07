import {addDoc, collection} from 'firebase/firestore';
import {db} from '../lib/Firebase'


export const createRecord = async ({collectionName, data}) => {
    try {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, data);
        console.log("Document written with ID: ", docRef.id);

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

