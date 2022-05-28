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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HamburgerIcon, CloseIcon, AddIcon, DownloadIcon, ChevronDownIcon } from '@chakra-ui/icons';

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
    FrameAnchorType,
    HorizontalPositionAlign,
    TabStop,
    TabStopPosition,
    TabStopType,
    VerticalPositionAlign,
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


function ViewQuestions() {
    const navigate = useNavigate();
    const params = useParams()
    const location = useLocation()
    const navigator = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [questions, setQuestions] = useState([])
    const [title, setTitle] = useState("")
    const [userData, setUserData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isResponseData, setIsResponseData] = useState(false)

    const [cookies] = useCookies(['user'])

    // const quillInstance = new quill();

    // const delta = quillInstance.getContents();
    // const quillToWordConfig = {
    //     exportAs: 'blob'
    // };

    useEffect(() => {


        const searchParams = new URLSearchParams(location.search)

        const isExamQuestion = searchParams.get("w") === "e"

        setTitle(searchParams.get('t'))



        // setUserData(cookies.user)

        const user = AES.decrypt(searchParams.get("u"), "exacheer")
        getUserData(user.toString(enc.Utf8)).then((res) => setUserData(res))



        switch (searchParams.get("w")) {
            case "e":
                getExams(searchParams)

                break;

            case "r":
                getResponse(searchParams, user.toString(enc.Utf8))
                break;
            default:

                getNormalQuestions()
                break;
        }


    }, [])

    const getResponse = async (searchParams, user) => {
        let docs = []
        await getDocs(collection(database, `/exams/${params.id}/responses/${user}/answers`)).then((examDocs) => {

            setQuestions(examDocs.docs)
            setUserData({ name: user, institution: "", })
            setIsLoading(false)
            // examDocs.docs[searchParams.get('a')].data().questions.every(async (question) => {

            //     await getDoc(doc(database, question.path)).then((aQuestion) => {
            //         docs.push(aQuestion)

            //     }).catch((err) => {
            //         toast.error(err.message, {
            //             position: "bottom-right",
            //             autoClose: 5000,
            //             hideProgressBar: false,
            //             closeOnClick: true,
            //             pauseOnHover: true,
            //             draggable: true,
            //             progress: undefined,
            //         });
            //     })
            // })
            setIsResponseData(true)
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

    const getExams = async (searchParams) => {
        let docs = []
        await getDocs(collection(database, `/exams/${params.id}/alts`)).then((examDocs) => {
            examDocs.docs[searchParams.get('a')].data().questions.every(async (question) => {

                await getDoc(doc(database, question.path)).then((aQuestion) => {
                    docs.push(aQuestion)
                    setQuestions([...docs])
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


    const getNormalQuestions = async () => {
        let docs = []
        await getDocs(query(collection(database, `/banks/${params.id}/questions`), orderBy("index"))).then((examDocs) => {
            setQuestions([...examDocs.docs])
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
    }

    const download = async (type) => {

        let _questions = []
        let _answers = []

        if (type === "q" || type === "qa") {
            _questions = [
                new Paragraph({

                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            break: 2,
                            text: "QUESTIONS",
                            bold: true,
                        })
                    ]
                }),


                ...questions.map((question, index) =>
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                break: 1
                            }),

                            ...question.data().question.split('\n').map((t, ti) => new TextRun({
                                text: ti === 0 ? `${index + 1}) ${t}` : `${t}`,
                                bold: true,
                                break: 1
                            })),
                            new TextRun({
                                break: 1
                            }),

                            ...question.data().options.map((option, optionIndex) =>
                                new TextRun({
                                    text: `${formatOptionIndex(optionIndex)}) ${option.optionText}\t\t`,
                                }),
                            )
                        ],
                    }),

                ),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            break: 3
                        })
                    ]
                }),
            ]
        }

        if (type === "a" || type === "qa") {

            _answers = [

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        (type === 'q' || type === "qa") && new PageBreak(),
                        new TextRun({
                            break: 2,
                            text: "ANSWERS",
                            bold: true,
                        })
                    ]
                }),

                new Paragraph({
                    border: {
                        right: {
                            color: "181A1B",
                            space: 5,
                            value: "single",
                            size: 6,
                        },

                    },
                    tabStops: [
                        {
                            type: TabStopType.LEFT,
                            position: 1065,
                            // position: TabStopPosition.MAX * 0.50,
                        },
                    ],
                    children: [
                        ...questions.map((question, index) =>
                            question.data().correctOptions.length > 1
                                ? new TextRun({
                                    text: `${index + 1}) [${question.data().correctOptions.map((correctOption, optionIndex) => correctOption)}]`
                                })
                                : new TextRun({
                                    break: (index + 1) % 7 === 0 ? 2 : 0,
                                    text: `${index + 1}) ${question.data().correctOptions[0]}\t\t`
                                    // text: `${index + 1}) ${question.data().correctOptions.length === 0 ? "" : `${question.data().correctOptions[0]}${index % 7 !== 0 && `\t\t`}`}`
                                })

                        ),


                    ],
                }),



                // new Paragraph({
                //     alignment: AlignmentType.LEFT,
                //     children: [
                //         new TextRun({
                //             break: 2,
                //             text: questions.map((question, index) => question.data().correctOptions.map((correctOption, optionIndex) => correctOption))
                //         })
                //     ]
                // })
            ]

        }


        const doc = new Document({
            title: title,
            creator: "Exacheer",

            sections: [{
                properties: {},
                // headers: {
                //     default: new Header({
                //         children: [
                //             new Paragraph({
                //                 children: [
                //                     new TextRun({
                //                         text: "https",
                //                         color: "8e8e8e"
                //                     })
                //                 ], alignment: AlignmentType.CENTER,
                //             })
                //         ],
                //     }),

                // },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                        color: "8e8e8e"
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [

                    new Paragraph({
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: title,
                                allCaps: true
                            })
                        ]
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: userData.institution,
                                allCaps: true
                            })
                        ]
                    }),

                    ..._questions,
                    ..._answers

                ],
            }],
        });

        // doc.Settings.addCompatibility().doNotExpandShiftReturn();

        const buffer = await Packer.toBlob(doc);
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

        saveAs(blob, `${title}-${userData.institution}.docx`)

    }



    return (
        <>
            <Title title="View Question" />
            <ToastContainer position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />

            <ProtectedRoute>
                {
                    isLoading ? <Spinner /> : <>
                        <NavBar isResponseData={isResponseData} download={download} author={userData && userData.name} />
                        <br />
                        <Box mx="auto" w={{ lg: 8 / 12, xl: 5 / 12 }}>

                            <Center marginTop={10} key={1}>
                                <Heading >
                                    <Text >
                                        {title}
                                    </Text>

                                </Heading>
                            </Center>
                            <Center key={2}>
                                {
                                    userData && <Text color="gray">
                                        {userData.institution}
                                    </Text>
                                }
                            </Center>

                            {/* <HStack  >
                                <Text
                                    as="span"
                                    padding={2}
                                    borderRadius={20}
                                    bg={(questions[0][question].isCorrect && questions[0][question].choices.includes(formatOptionIndex(optionIndex))) ? 'green.100' : (!questions[0][question].isCorrect && questions[0][question].choices.includes(formatOptionIndex(optionIndex))) && 'red.100'}
                                // bg={questions[0][question].correctOptions.includes(formatOptionIndex(optionIndex)) && 'green.100'}
                                > {formatOptionIndex(optionIndex)}) {option.optionText}</Text>
                            </HStack> */}


                            {
                                questions.map((question, index) => <>
                                    <Text whiteSpace="pre-line" fontWeight="bold" key={index}>{index + 1}) {question.data().question}</Text>
                                    {
                                        question.data().options.map((option, optionIndex) =>
                                            <>
                                                <Stack key={optionIndex} direction='row' marginY={5} >
                                                    <HStack borderRadius={20} bgColor={question.data().correctOptions.includes(formatOptionIndex(optionIndex)) && 'green.100'}>
                                                        <Text as="span" padding={2} borderRadius={20} bg={(isResponseData && !question.data().isCorrect && question.data().choices.includes(formatOptionIndex(optionIndex))) && 'red.100'} > {formatOptionIndex(optionIndex)}) {option.optionText}</Text>
                                                    </HStack>
                                                </Stack>

                                            </>
                                        )
                                    }

                                </>

                                )


                            }
                        </Box></>
                }
            </ProtectedRoute>



        </>

    )
}

export default ViewQuestions


const Links = [];

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}>
        {children}
    </Link>
);

function NavBar({ author, download, isResponseData }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box w="full" position="fixed" bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Text color="gray">@{author}</Text>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    {
                        !isResponseData && <Flex alignItems={'center'}>

                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    Download
                                </MenuButton>
                                <MenuList>
                                    <MenuItem key={1} onClick={() => download('a')}>Answers Only</MenuItem>
                                    <MenuItem key={2} onClick={() => download('q')}>Questions only</MenuItem>
                                    <MenuItem key={3} onClick={() => download('qa')}>Both questions & answers </MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                    }
                </Flex>
                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>

        </>
    );
}