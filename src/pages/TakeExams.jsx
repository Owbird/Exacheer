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
import { HamburgerIcon, CloseIcon, AddIcon, DownloadIcon, ChevronDownIcon } from '@chakra-ui/icons';
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

import {
    Packer,
    Paragraph,
    TextRun,
    Document,
    Header,
    HeadingLevel,
    AlignmentType,
    PageBreak,
    Footer,
    PageNumber,
} from "docx"
import { saveAs } from 'file-saver';
import React from "react";
import Spinner from '../components/Spinner';
import ProtectedRoute from '../components/ProtectedRoute';
import { useCookies } from 'react-cookie';
import { AES, enc } from 'crypto-js';

import { Input, FormLabel } from '@chakra-ui/react';
import { secondsToMinutes } from 'date-fns';
import { Encrypt, Decrypt } from '../utils/cryptography';
const TakeExams = () => {

    const navigate = useNavigate();
    const params = useParams()
    const location = useLocation()
    const navigator = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [questions, setQuestions] = useState([])
    const [examData, setExamData] = useState("")
    const [userData, setUserData] = useState({})
    const [indexNo, setIndexNo] = useState("")
    const [examPwd, setExamPwd] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isValidated, setIsValidated] = useState(false)

    const [cookies, setCookies, removeCookies] = useCookies(['examInfo'])
    const [timeCookies, setTimeCookies, removeTimeCookies] = useCookies(['timeInfo'])

    const [timeUP, setTimeUP] = useState(false)

    const [selectedAlt, setSelectedAlt] = useState()

    const [timer, setTimer] = useState("00:00:00")

    const encDec = (data, isEnc) => {
        // if (!isEnc) {
        //     console.log(data, isEnc, "enc dec")
        // }
        // return !isEnc ? JSON.parse(Decrypt(data)) : Encrypt(JSON.stringify(data))

        return data
    }


    useEffect(() => {



        if (cookies.examInfo) {
            setIsValidated(true)
            setSelectedAlt(cookies.examInfo.alt)
        } else {
            onOpen()
        }

        getExamData()


    }, [])

    const startTimer = (maxAge) => {
        let time = maxAge
        if (time === 0) {
            toast.error("TIME UP!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeUP(true)
        } else {
            const interval = setInterval(() => {
                if (time === 0 || time === -1) {
                    toast.error("TIME UP!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeUP(true)
                    submit()
                    clearInterval(interval)
                } else {
                    time--
                    setTimeCookies('timeInfo', encDec({ maxAge: time }, true), { path: '/' })
                }


                let h = Math.floor(time / 3600);
                let m = Math.floor(time % 3600 / 60);
                let s = Math.floor(time % 3600 % 60);

                if ((m === 30 || m === 10 || m === 5 || m === 1) && h === 0 && s === 0) {
                    toast.warning(`${m} minutes more`, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }



                let hours = h > 0 ? h.toString() : "00";
                let mins = m > 0 ? m.toString() : "00";
                let secs = s > 0 ? s.toString() : "00";
                setTimer(`${hours.length === 1 ? "0" + hours : hours}:${mins.length === 1 ? "0" + mins : mins}:${secs.length === 1 ? "0" + secs : secs}`)

                // console.log(`${hours.length === 1 ? "0" + hours : hours}:${mins.length === 1 ? "0" + mins : mins}:${secs.length === 1 ? "0" + secs : secs}`)



            }, 1000);
        }
    }

    const getExamData = async () => {
        await getDoc(doc(database, `/exams/${params.id}`)).then((examData) => {
            setExamData(examData.data())
            getExams(examData.data())
        }).catch((err) => {
            toast.error(err.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    const getExams = async (examData) => {
        let alt = cookies.examInfo ? encDec(cookies.examInfo, false).alt : Math.floor(Math.random() * parseInt(examData.totalAlts))
        // console.log('Chosen alt', encDec(cookies.examInfo, false))
        if (examData.totalAlts === "1") {
            alt = 1
        }
        onSnapshot(query(collection(database, `/exams/${params.id}/alts`), where("alt", '==', alt)), (docs) => {
            setSelectedAlt(alt)
            let chosenDocs = []
            // await getDocs(collection(database, `/exams/${params.id}/alts`)).then((altDocs) => {
            //     console.log("Alt", alt)

            docs.docs[0].data().questions.every(async (question) => {

                await getDoc(doc(database, question.path)).then((aQuestion) => {
                    chosenDocs.push(aQuestion)
                    setQuestions([...chosenDocs])
                    setIsLoading(false)


                }).catch((err) => {
                    toast.error(err.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
            })

            if (cookies.examInfo) {
                const stdData = encDec(cookies.examInfo, false)
                setIndexNo(stdData.indexNumber)
                startTimer(encDec(timeCookies.timeInfo, false).maxAge)
            }


        })

    }

    const startExam = async () => {
        if (examPwd === examData.examPassword && indexNo) {
            await setDoc(doc(database, `/exams/${params.id}/responses/${indexNo}`), {
                alt: selectedAlt,
                indexNumber: indexNo,
            }).then(() => {
                const maxAge = moment(examData.endTime.toDate()).diff(moment(examData.startTime.toDate()), 'seconds')
                const encryptedExamInfo = encDec({
                    alt: selectedAlt,
                    indexNumber: indexNo,
                }, true)

                const encryptedTimeInfo = encDec({ maxAge }, true)
                setCookies('examInfo',
                    encryptedExamInfo,
                    { path: '/', })
                setTimeCookies('timeInfo', encryptedTimeInfo, { path: '/' })
                setIsValidated(true)
                onClose()
                startTimer(maxAge)
                toast.success("All the best", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })



        } else {
            toast.error("Wrong password", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const uploadToCloud = async (data) => {


        await setDoc(doc(database, `/exams/${params.id}/responses/${indexNo}/answers/${data.questionNumber}`), data).then((res) => {
            toast.success(`Question ${data.questionNumber} saved`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            const cData = {}
            cData[data.questionNumber] = data.choices.toString()


            setCookies('examInfo', encDec({ ...cookies.examInfo, ...cData }, true), { path: '/' })

        })

    }

    const submit = () => {
        const examInfo = encDec(cookies.examInfo, false)
        // let tot = 0;
        // for (const key in examInfo) {
        //     if (key !== "alt" && key !== "indexNumber") {
        //         if (examInfo[key].isCorrect) {
        //             tot++
        //         }
        //     }
        // }
        // console.log(tot, "Score")
        // uploadToCloud({ ...examInfo, totalScore: tot })

        removeCookies('examInfo', { path: '/' })
        removeTimeCookies('timeInfo', { path: '/' })


        navigate(`/reports/${params.id}/${encodeURIComponent(Encrypt(examInfo.indexNumber))}`)
    }

    return (
        <>
            <Title title="Take Exam" ></Title>
            <ToastContainer position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
            {
                isLoading
                    ? <Spinner />
                    : timeUP
                        ? <Center>
                            <Box mx="auto" w={{ lg: 8 / 12, xl: 5 / 12 }} textAlign="center" py={10} px={6}>
                                <Box display="inline-block">
                                    <Flex
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="center"
                                        bg={'red.500'}
                                        rounded={'50px'}
                                        w={'55px'}
                                        h={'55px'}
                                        textAlign="center">
                                        <CloseIcon boxSize={'20px'} color={'white'} />
                                    </Flex>
                                </Box>
                                <Heading as="h2" size="xl" mt={6} mb={2}>
                                    We have exhausted our time! 😢
                                </Heading>
                                <Text color={'gray.500'}>
                                    The time allocated to this exam has elapsed. Please contact your examiner for any issues.
                                </Text>
                            </Box>
                        </Center>
                        : <>

                            <Box mx="auto" w={{ lg: 8 / 12, xl: 5 / 12 }}>

                                <Center key={1}>
                                    <Heading >
                                        <Text >
                                            {examData.title}
                                        </Text>

                                    </Heading>
                                </Center>
                                <Center key={2}>
                                    {
                                        <Text color="gray">
                                            {timer}
                                        </Text>
                                    }
                                </Center>


                                <CustomModal
                                    onClose={onClose}
                                    title="Details"
                                    isOpen={isOpen}
                                    hasManualClose={true}
                                    onOpen={onOpen}
                                    secondaryAction={startExam}
                                    bg='blue.400'
                                    bgHover="blue.500"
                                    btnText="Start">
                                    <FormLabel>
                                        Index number
                                    </FormLabel>
                                    <Input onChange={(e) => setIndexNo(e.target.value)} placeholder="9404619" />
                                    <FormLabel>
                                        Exam password
                                    </FormLabel>
                                    <Input onChange={(e) => setExamPwd(e.target.value)} type="password" placeholder="********" />
                                </CustomModal>


                                {
                                    questions.map((question, index) => <>
                                        <Text id={question.id} whiteSpace="pre-line" fontWeight="bold" key={index}>{index + 1}) {isValidated ? question.data().question : "*".repeat(question.data().question.length)}</Text>
                                        {
                                            question.data().optionType === "One Selection"
                                                ? <>
                                                    <RadioGroup
                                                        defaultValue={cookies.examInfo && encDec(cookies.examInfo, false)[index + 1] && encDec(cookies.examInfo, false)[index + 1]}
                                                    >
                                                        {question.data().options.map((option, optionIndex) =>
                                                            <Stack key={optionIndex} direction='row' marginY={5} >
                                                                <HStack>
                                                                    <Radio
                                                                        // isChecked={cookies.examInfo && encDec(cookies.examInfo, false)[index + 1] && encDec(cookies.examInfo, false)[index + 1].choices.toString() === [formatOptionIndex(optionIndex)].toString()}
                                                                        // defaultChecked={cookies.examInfo && cookies.examInfo[index + 1].includes(formatOptionIndex(optionIndex))}
                                                                        // isChecked={cookies.examInfo && cookies.examInfo[index + 1].includes(formatOptionIndex(optionIndex))}
                                                                        onChange={(e) => {

                                                                            const newAnswers = {
                                                                                questionNumber: index + 1,
                                                                                choices: [formatOptionIndex(optionIndex)],
                                                                                correctOptions: question.data().correctOptions,
                                                                                question: question.data().question,
                                                                                options: question.data().options,
                                                                                isCorrect: [formatOptionIndex(optionIndex)].toString() === question.data().correctOptions.toString()

                                                                            }



                                                                            uploadToCloud(newAnswers)


                                                                        }}
                                                                        value={formatOptionIndex(optionIndex)} >
                                                                        {formatOptionIndex(optionIndex)}) {isValidated ? option.optionText : "#".repeat(option.optionText.length)}
                                                                    </Radio>
                                                                </HStack>
                                                            </Stack>

                                                        )}
                                                    </RadioGroup>
                                                </>
                                                : <>
                                                    {question.data().options.map((option, optionIndex) =>
                                                        <Stack key={optionIndex} direction='row' marginY={5} >
                                                            <HStack>
                                                                <Checkbox

                                                                    isChecked={cookies.examInfo && encDec(cookies.examInfo, false)[index + 1] && encDec(cookies.examInfo, false)[index + 1].choices.includes(formatOptionIndex(optionIndex))}

                                                                    onChange={(e) => {

                                                                        if (!encDec(cookies.examInfo, false)[index + 1] || encDec(cookies.examInfo, false)[index + 1].choices.length === 0) {
                                                                            const temp = {
                                                                                ...question.data().question,
                                                                                questionNumber: index + 1,


                                                                            }
                                                                            temp[index + 1] = {}
                                                                            temp[index + 1]['questionNumber'] = index + 1

                                                                            temp[index + 1]['choices'] = [formatOptionIndex(optionIndex)]
                                                                            temp[index + 1]['correctOptions'] = question.data().correctOptions
                                                                            temp[index + 1]['isCorrect'] = question.data().correctOptions.toString() === [formatOptionIndex(optionIndex)].toString()
                                                                            temp[index + 1]['question'] = question.data().question
                                                                            temp[index + 1]['options'] = question.data().options

                                                                            uploadToCloud({ ...encDec(cookies.examInfo, false), ...temp })

                                                                        } else {
                                                                            if (encDec(cookies.examInfo, false)[index + 1].choices.includes(formatOptionIndex(optionIndex))) {
                                                                                const temp = encDec(cookies.examInfo, false)
                                                                                temp[index + 1].choices.splice(temp[index + 1].choices.indexOf(formatOptionIndex(optionIndex)), 1)
                                                                                temp[index + 1].isCorrect = question.data().correctOptions.sort().toString() === temp[index + 1].choices.sort().toString()

                                                                                uploadToCloud(temp)


                                                                            } else {
                                                                                const temp = encDec(cookies.examInfo, false)

                                                                                temp[index + 1].choices.push(formatOptionIndex(optionIndex))
                                                                                temp[index + 1].isCorrect = question.data().correctOptions.sort().toString() === temp[index + 1].choices.sort().toString()
                                                                                uploadToCloud(temp)

                                                                            }
                                                                        }

                                                                        // const newAnswers = {}


                                                                        // console.log(newAnswers[index + 1])

                                                                        // if (answers[index + 1] !== undefined) {

                                                                        //     console.log(answers)

                                                                        //     // newAnswers[index + 1] = newAnswers[index + 1].push(formatOptionIndex(optionIndex))

                                                                        // } else {
                                                                        //     // newAnswers[index + 1] = newAnswers[index + 1] = [formatOptionIndex(optionIndex)]

                                                                        // }
                                                                        // console.log({ ...answers, ...newAnswers })
                                                                        // setAnswers({ ...answers, ...newAnswers })
                                                                    }} value={option.optionText}>{formatOptionIndex(optionIndex)}) {isValidated ? option.optionText : "#".repeat(option.optionText.length)}</Checkbox>
                                                            </HStack>
                                                        </Stack>

                                                    )}
                                                </>

                                        }



                                    </>

                                    )

                                }
                                <Center>
                                    <Button marginY={10}
                                        onClick={submit}>
                                        Submit
                                    </Button>
                                </Center>
                            </Box>
                        </>
            }

        </>
    )
}

export default TakeExams
