import { useEffect, useState } from 'react'


import {
    Box,
    useColorModeValue,
    SimpleGrid,
    Button,
    Stack,
    Text,
    Heading,
    GridItem,
    Center,
    Flex,
    Radio,
    RadioGroup,
    CheckboxGroup,
    Checkbox,
    Divider,
    Avatar,
    HStack,
    Link,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,

} from '@chakra-ui/react';
import moment from 'moment';

import { ToastContainer, toast } from 'react-toastify';
import { HamburgerIcon, CloseIcon, AddIcon, DownloadIcon, CheckCircleIcon } from '@chakra-ui/icons';
import 'react-toastify/dist/ReactToastify.css';

import { FaPlusCircle } from "react-icons/fa"
import { BiRadioCircleMarked, BiCheckboxChecked, BiText } from "react-icons/bi"
import { DeleteIcon } from '@chakra-ui/icons'

import { where, doc, onSnapshot, query, collection, orderBy, setDoc, getDocs, getDoc, updateDoc, addDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { database, banksCollection, deleteData, getUserData } from "../utils/firebase"

import Title from '../components/Title';
import formatOptionIndex from "../utils/formatOptionIndex"

import { useNavigate, useParams, useLocation } from 'react-router-dom';

import CustomModal from '../components/CustomModal';
import { useDisclosure } from '@chakra-ui/react'
import importGForm from '../utils/importGForm';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Decrypt } from '../utils/cryptography';

export default function ReportCard() {
    const params = useParams()

    const [totalScore, setTotalScore] = useState()
    const [totalQuestions, setTotalQuestions] = useState()

    useEffect(() => {



        getDocs(collection(database, `/exams/${params.examId}/responses/${Decrypt(params.indexNumber)}/answers`)).then((res) => {
            const totalScore = res.docs.filter(x => x.data().isCorrect).length

            setTotalScore(totalScore)
            setTotalQuestions(res.docs.length)

            updateDoc(doc(database, `/exams/${params.examId}/responses/${Decrypt(params.indexNumber)}/`), { totalScore })
        })
    }, [])
    return (
        <>
            <Title title="Report Card" />
            <Box textAlign="center" py={10} px={6}>
                <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    Hello {Decrypt(params.indexNumber)}
                </Heading>
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    You scored {totalScore}!
                </Heading>
                <Text color={'gray.500'}>
                    Please contact your examiner if there is any issue. Thank you.
                </Text>
            </Box>
        </>
    );
}
