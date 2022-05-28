import React, { useState, useEffect } from 'react';
import {
    Box,
    useColorModeValue,
    SimpleGrid,
    Button,
    Stack,
    Text,
    Heading,
    GridItem,
    HStack,
    FormLabel,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    chakra,
    Flex,
    Input,
    Select,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    CloseButton,
    IconButton,
    Collapse,
    Menu,
    MenuItem,
    MenuButton,
    MenuList,

    Checkbox,
    CheckboxGroup,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useBreakpointValue,
    useDisclosure,

} from '@chakra-ui/react';

import { IoMdOpen } from "react-icons/io"

import { Formik, Form, Field } from 'formik';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaEye, FaFilter, FaPlusCircle } from "react-icons/fa"
import { BiRadioCircleMarked, BiCheckboxChecked, BiText } from "react-icons/bi"
import { DeleteIcon } from '@chakra-ui/icons'

import { where, doc, onSnapshot, query, collection, orderBy, setDoc, getDocs, getDoc, Timestamp, updateDoc, addDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { database, banksCollection, deleteData } from "../utils/firebase"

import Title from '../components/Title';
import formatOptionIndex from "../utils/formatOptionIndex"

import { useNavigate, useParams, Link } from 'react-router-dom';

import CustomModal from '../components/CustomModal';
import importGForm from '../utils/importGForm';

import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import ReactTimeago from 'react-timeago';
import timeago_formatter from '../utils/timeago_formatter';
import BankCard from '../components/BankCard';
import ProtectedRoute from '../components/ProtectedRoute';
import { useCookies } from 'react-cookie';
import { AES } from 'crypto-js';
import {
    Calendar,
    CalendarDefaultTheme,
    CalendarControls,
    CalendarPrevButton,
    CalendarNextButton,
    CalendarMonths,
    CalendarMonth,
    CalendarMonthName,
    CalendarWeek,
    CalendarDays,
} from '@uselessdev/datepicker'

import moment from 'moment';


function AddQuestions() {
    const navigate = useNavigate();
    const params = useParams()

    const navigator = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpenExamModal,
        onOpen: onOpenExamModal,
        onClose: onCloseExamModal
    } = useDisclosure()

    const [banks, setBanks] = useState([])
    const [allBanks, setAllBanks] = useState([])
    const [selectedBanks, setSelectedBanks] = useState([])
    const [alts, setAlts] = useState([])
    const [filter, setFilter] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [examData, setexamData] = useState()
    const [startTime, setStartTime] = useState(moment().add(1, "hours").format("YYYY-MM-DDThh:mm"))
    const [endTime, setEndTime] = useState(moment().add(3, "hours").format("YYYY-MM-DDThh:mm"))
    const [examPassword, setExamPassword] = useState("")
    const [totalSelectedQuestions, setTotalSelectedQuestions] = useState(0)


    // / alts / ${ examData.id }/view
    useEffect(() => {

        onSnapshot(query(doc(database, `/exams/${params.id}/`)), (doc) => {

            setexamData(doc.data())

        })


        // onSnapshot(query(collection(database, '/banks/'), orderBy('lastEdit', 'desc')), (doc) => {
        //     console.log(doc.docs)

        //     if (doc.docs.length === 0) {
        //         console.log("Running")
        //     } else {
        //         setBanks(doc.docs)
        //         setAllBanks(doc.docs)

        //         // doc.docs.forEach((bank) => {
        //         //     if (doc.data().isPublic === true) {
        //         //         setPublicBanks([])
        //         //     }
        //         // })
        //     }
        // })

        onSnapshot(query(collection(database, `/exams/${params.id}/alts`), orderBy('alt')), (doc) => {
            console.log(doc.docs)

            if (doc.docs.length === 0) {
                console.log("Running")

                getDocs(query(collection(database, '/banks/'), orderBy('lastEdit', 'desc'))).then((value) => {

                    setBanks(value.docs)
                    setAllBanks(value.docs)
                })
            }
            else {
                setAlts(doc.docs)

                //         // doc.docs.forEach((bank) => {
                //         //     if (doc.data().isPublic === true) {
                //         //         setPublicBanks([])
                //         //     }
                //         // })
            }
        })



    }, [])

    const done = async (values) => {

        if (values.totalQuestions > totalSelectedQuestions) {
            toast.error("Number of questions cant't be greater than selected questions", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });


            return
        }


        console.log(values)
        let proceed = true

        let questions = []

        for (let index = 0; index < selectedBanks.length; index++) {

            let selectedBank = selectedBanks[index]
            let docRef = collection(database, `/banks/${selectedBank.id}/questions`)

            const docSnap = await getDocs(docRef)

            docSnap.docs.forEach((element) => {

                questions.push(element)

            })

        };

        console.log(questions, questions.length)

        const alts = {}

        for (let index = 1; index <= parseInt(values.totalAlts); index++) {
            console.log("generating alt", index)

            // alts[`alt${index}`] = 
            // console.log(questions.sort(() => Math.random() - 0.5)[0].question)

            let a = []
            let ab = []

            // console.log(a.some(x => x.id === questions[pp].id))
            // a.push(questions[Math.floor(Math.random() * questions.length)])


            while (a.length != values.totalQuestions) {
                console.log(a.length, values.totalQuestions)
                const pp = Math.floor(Math.random() * questions.length)

                if (!(ab.includes(pp))) {
                    a.push(questions[pp].ref)
                    ab.push(pp)
                }

            }


            alts[`alt${index}`] = { questions: a, alt: index }

            addDoc(collection(database, `/exams/${params.id}/alts`), { questions: a, alt: index }).then(() => {
                updateBank("lastEdit")
            })
        }

        console.log(alts)

        updateBank('totals', values)

        // questions.every((question) => {
        //     if (question.data().correctOptions.length === 0) {
        //         toast.error("Some questions are unanswered", {
        //             position: "bottom-right",
        //             autoClose: 5000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //         });

        //         proceed = false

        //         return false
        //     }

        //     return true
        // })

        // if (proceed) {
        //     navigate('/dashboard')
        // }


    }

    const updateBank = async (action, value) => {

        let docRef = doc(database, `/exams/${params.id}`)

        switch (action) {
            case 'title':
                updateDoc(docRef, { title: value, lastEdit: Timestamp.now() })
                break;
            case "isPublic":
                updateDoc(docRef, { isPublic: value, lastEdit: Timestamp.now() })
                break
            case "lastEdit":
                updateDoc(docRef, { lastEdit: Timestamp.now() })
                break
            case "totals":
                updateDoc(docRef, { ...value, lastEdit: Timestamp.now() })
                break
            case "makeOnline":
                updateDoc(docRef, {
                    isOnline: true,
                    startTime: moment(startTime).toDate(),
                    endTime: moment(endTime).toDate(),
                    lastEdit: Timestamp.now(),
                    examPassword,
                })
            default:
                break;
        }

    }

    const changeFilter = async (value) => {
        setFilter(value)

        let newQuery;
        let newDocs;

        switch (value) {
            case "public":
                newDocs = allBanks.filter(bank => bank.data().isPublic === true)
                break

            case "private":
                newDocs = allBanks.filter(bank => bank.data().isPublic === false)
                break;

            default:
                newDocs = allBanks
                break;

        }
        console.log(newDocs)
        setBanks(newDocs)

    }

    const updateSelectedBanks = (value) => {

        console.log(value)

        if (!selectedBanks.some(selectedBank => selectedBank.id === value.id)) {
            setSelectedBanks([...selectedBanks, value])
            setTotalSelectedQuestions(totalSelectedQuestions + value.totalQuestions)
        } else {
            const newBanks = selectedBanks

            newBanks.splice(newBanks.indexOf(value), 1)
            setTotalSelectedQuestions(totalSelectedQuestions - value.totalQuestions)


            setSelectedBanks([...newBanks])
        }

    }

    const useOnline = () => {
        if (examData.isOnline) {
            navigate(`/exams/${params.id}/stats`)
            // navigate(`/exams/${params.id}/online`)
        } else {
            onOpenExamModal()
        }

    }



    const generateOnlineLink = async () => {
        await updateBank("makeOnline")
        onCloseExamModal()
        navigate(`/exams/${params.id}/stats`)
    }

    return (
        <>
            <Title title='Add question' />
            <ProtectedRoute>
                <CustomModal
                    onClose={onClose}
                    title="Select question banks"
                    isOpen={isOpen}
                    onOpen={onOpen}
                    isPerfomingAction={isImporting}
                    secondaryAction={onClose}
                    bg='blue.400'
                    bgHover="blue.500"
                    btnText="Done">
                    <HStack>
                        <Input placeholder="Bank Title" onChange={(event) => {


                            if (event.target.value) {
                                setBanks(banks.filter(bank => bank.data().title.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())))
                            } else {
                                setBanks(allBanks)
                            }
                        }} />
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                <FaFilter />
                            </MenuButton>
                            <MenuList>
                                <MenuItem bg={filter === "all" && "green.100"} onClick={() => changeFilter("all")}>All</MenuItem>
                                <MenuItem bg={filter === "public" && "green.100"} onClick={() => changeFilter("public")}>Public</MenuItem>
                                <MenuItem bg={filter === "private" && "green.100"} onClick={() => changeFilter("private")}>Private</MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                    <br />
                    {
                        banks.map((bank, index) =>
                            <Box
                                bgColor={selectedBanks.some(selectedBank => selectedBank.id === bank.data().id) && "green.100"}
                                key={index}
                                onClick={() => updateSelectedBanks(bank.data())}
                                marginY={2}
                                maxW="sm"
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden">
                                <Box m="5" as="a" >
                                    <Heading m="5" mb="0" as="h4" size="md">{bank.data().title}</Heading>
                                    <Text m="5" mt="0">{bank.data().totalQuestions} Questions</Text>
                                    <Text m="5" mt="0">{bank.data().isPublic ? "Public" : "Private"}</Text>
                                </Box>
                            </Box>
                        )
                    }

                    {/* <Input value={googleFormURL} onChange={(e) => setGoogleFormURL(e.target.value)} placeholder="Enter google form link" /> */}
                </CustomModal>
                <CustomModal
                    onClose={onCloseExamModal}
                    title="Set up online Exam"
                    isOpen={isOpenExamModal}
                    onOpen={onOpenExamModal}
                    isPerfomingAction={isImporting}
                    secondaryAction={generateOnlineLink}
                    bg='blue.400'
                    bgHover="blue.500"
                    btnText="Proceed">
                    <FormLabel id="time" color="gray">
                        Start time
                    </FormLabel>

                    <Input id="time" defaultValue={startTime} type="datetime-local" placeholder="04:45 AM" onChange={(event) => setStartTime(event.target.value)} />


                    <FormLabel id="time" color="gray">
                        End time
                    </FormLabel>

                    <Input id="time" defaultValue={endTime} type="datetime-local" placeholder="04:45 AM" onChange={(event) => setEndTime(event.target.value)} />

                    <FormLabel id="password" color="gray">
                        Exam password
                    </FormLabel>

                    <Input id="password" type="password" placeholder="*****" onChange={(event) => setExamPassword(event.target.value)} />


                    <br />
                    {/* <Text color="gray">Duration: {moment(endTime).from(startTime, true)}</Text> */}

                    {/* <Input value={googleFormURL} onChange={(e) => setGoogleFormURL(e.target.value)} placeholder="Enter google form link" /> */}
                </CustomModal>
                <ToastContainer position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover />

                <NavBar useOnline={useOnline} id={params.id} updateBank={updateBank} onOpen={onOpen} examData={examData} />

                {
                    alts.length === 0 ? <Flex
                        minH={'100vh'}
                        // align={'center'}
                        justify={'center'}
                    // bg={useColorModeValue('gray.50', 'gray.800')}
                    >
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                            <Box
                                rounded={'lg'}
                                // bg={useColorModeValue('white', 'gray.700')}
                                boxShadow={'lg'}
                                p={8}>
                                <Formik
                                    initialValues={{ totalAlts: "", totalQuestions: "" }}
                                    onSubmit={async (values, { setSubmitting }) => await done(values).then(() => setSubmitting(false))}>
                                    {({ values, isSubmitting, handleChange }) => <Form>
                                        <Stack spacing={4}>
                                            <Box>
                                                <Text align="center" borderRadius={100} bgColor="green.100">{totalSelectedQuestions} questions</Text>
                                                <FormControl id="totalQuestions" isRequired>
                                                    <FormLabel id="totalQuestions">Total Questions</FormLabel>
                                                    <Input width="100px" id="totalQuestions" onChange={handleChange} value={values.totalQuestions} type="text" placeholder="140" />
                                                </FormControl>
                                                <FormControl id="totalAlts" isRequired>
                                                    <FormLabel id="totalAlts">Total Alternates</FormLabel>
                                                    <Input width="100px" id="totalAlts" onChange={handleChange} value={values.totalAlts} type="text" placeholder="10" />
                                                </FormControl>
                                            </Box>

                                            <HStack >
                                                {/* <FormControl id="isPublic">

                                            <Checkbox
                                                onChange={handleChange}
                                                value={values.isPublic}
                                                id="isPublic"
                                                rounded="md"
                                                defaultChecked={true}
                                            >
                                                Make public
                                            </Checkbox>

                                        </FormControl> */}

                                            </HStack>

                                            <Stack spacing={10} pt={2}>

                                                <Button

                                                    onClick={onOpen}
                                                    size="lg"
                                                    bg={'blue.400'}
                                                    color={'white'}
                                                    _hover={{
                                                        bg: 'blue.500',
                                                    }}>
                                                    Select question banks
                                                </Button>

                                                {
                                                    selectedBanks.length >= 1
                                                    && <Button
                                                        loadingText="Generating"
                                                        isLoading={isSubmitting}
                                                        type="submit"
                                                        size="lg"
                                                        bg={'green.400'}
                                                        color={'white'}
                                                        _hover={{
                                                            bg: 'blue.500',
                                                        }}>
                                                        Generate
                                                    </Button>
                                                }

                                            </Stack>
                                        </Stack>
                                    </Form>}
                                </Formik>
                            </Box>
                        </Stack>
                    </Flex> : <Alts alts={alts} id={params.id} examData={examData} />
                }
            </ProtectedRoute>
        </>
    );
}

export default AddQuestions

function Alts({ alts, id, examData }) {
    const [cookies] = useCookies(['user'])
    return (
        <>
            {
                alts.map((alt, index) =>
                    < Link
                        key={index}
                        to={`/questions/${id}/view?w=e&a=${index}&t=${examData.title} Alt ${alt.data().alt}&u=${encodeURIComponent(AES.encrypt(examData.user, "exacheer"))}`} >

                        <Box
                            // onClick={() => navigator(`/questions/${id}/view?w=e`)}
                            marginY={2}
                            maxW="sm"
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden">
                            <Box m="5" as="a" >
                                <HStack spacing="auto">
                                    <Heading alignContent="center" alignItems="center" alignSelf="center" m="5" mb="0" as="h4" size="md">Alt {alt.data().alt}</Heading>
                                    <IoMdOpen size={30} />
                                </HStack>
                                {/* <Text m="5" mt="0">{bank.data().isPublic ? "Public" : "Private"}</Text> */}
                            </Box>
                        </Box>
                    </Link>
                )
            }
        </>
    )
}


function NavBar({ id, updateBank, onOpen, examData, useOnline }) {

    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        examData && <Box
            flex={{ base: 1 }}
            justify={{ base: 'center', md: 'start' }}
            ml={10}
            // bg={useColorModeValue('white', 'gray.800')}
            // color={useColorModeValue('gray.600', 'white')}
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            // borderColor={useColorModeValue('gray.200', 'gray.900')}
            align={'center'}>
            <HStack spacing="auto"  >
                <HStack>
                    <Editable defaultValue={examData.title} placeholder="Bank title" >
                        <EditablePreview />
                        <EditableInput onChange={(event) => updateBank("title", event.target.value)} />
                    </Editable>
                </HStack>

                <Text as="span">
                    Last edit was{" "}

                    <ReactTimeago formatter={timeago_formatter} date={examData.lastEdit.toDate().toString()} />

                </Text>


                <HStack>

                    <Button
                        onClick={useOnline}
                        type="button"
                        ml={5}
                        variant="solid"
                        size="sm"
                        fontWeight="medium"
                        _focus={{ shadow: "none" }}
                        color='white'
                        bgColor='blue.400'
                        _hover={{
                            bgColor: 'blue.300'
                        }}>
                        <Text>{examData.isOnline ? "Online statistics" : "Make online"} </Text>
                    </Button>


                </HStack>
            </HStack></Box >
    );

}

