import { where, doc, onSnapshot, query, collection, orderBy, setDoc, getDoc, Timestamp, updateDoc, addDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { database, banksCollection, deleteData } from "../utils/firebase"

export default async (id) => {
    const questions = [
        {
            "index": 2,
            "question": "Which among the following falls under the definition of conservation?\n1) Conservation deals with how to manage natural resources\n2) Conservation deals with the consequences of wasteful use of property\n3) Conservation deals with logistics of production goods\n4) Conservation deals with genetically modified crops\nWhich of the following are correct?",
            // "question": "Which of the following statements are true about Engineering Ethics?\n1) Engineering Ethics is an area of practical or applied ethics\n2) The aim of Engineering Ethics is to illuminate the ethical dimensions of engineering practice\n3) Engineering Ethics is constituted of an eclectic contribution of all schools of ethics\n4) Professional Engineering Societies are a major source of codes for engineering ethics.\nWhich of the following is correct?",
            "correctOptions": [
                "B"
            ],
            "optionType": "One Selection",
            "options": [
                {
                    "optionText": "1 and 4"
                },
                {
                    "optionText": "1 and 2"
                },
                {
                    "optionText": "1, 2, 3 and 4"
                },
                {
                    "optionText": "1, 2 and 4"

                }
            ]
        },

    ]

    questions.every(async (x) => {
        await addDoc(collection(database, `/banks/${id}/questions`), {
            question: x.question,
            index: x.index,
            optionType: x.optionType,
            options: x.options,
            correctOptions: x.correctOptions
        })
    })
}