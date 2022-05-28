import {
    Heading,
    Box,
    Button,
    useColorModeValue,
    SimpleGrid,
    GridItem,
    Center,
} from '@chakra-ui/react';

import { useEffect, useState } from "react"
import { where, onSnapshot, query, collection } from "firebase/firestore";
import { database, examsCollection } from "../utils/firebase"
import ExamCard from '../components/ExamCard';
import { useNavigate } from "react-router-dom"


export default function ExamStudio({ userData }) {
    const navigator = useNavigate()
    const [exams, setExams] = useState([])

    useEffect(() => {

        onSnapshot(query(examsCollection, where("user", "==", userData.email)), (doc) => {
            console.log(doc.docs)
            setExams(doc.docs)
        })


    }, [])
    return (
        <SimpleGrid columns={3} spacing={6}>
            <GridItem >
                <ExamCard isNewCard={true} exams={{}} />
            </GridItem>

            {
                exams.map((exam) =>
                    <GridItem key={exam.id}>
                        <ExamCard exam={exam.data()} />
                    </GridItem>
                )
            }

        </SimpleGrid>
    );
}
