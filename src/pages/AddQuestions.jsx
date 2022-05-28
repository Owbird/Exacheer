import React, { useState, useEffect } from 'react';
import {
    Box,
    useColorModeValue,
    SimpleGrid,
    Button,
    Stack,
    Textarea,
    Text,
    Heading,
    GridItem,
    HStack,
    FormLabel,
    Editable,
    EditableInput,
    EditablePreview,
    EditableTextarea,
    FormControl,
    chakra,
    Flex,
    Checkbox,
    Input,
    Select,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    CloseButton,
    IconButton,
    Collapse,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useBreakpointValue,
    useDisclosure,

} from '@chakra-ui/react';

import { Formik, Form, Field } from 'formik';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaEye, FaPlusCircle } from "react-icons/fa"
import { BiRadioCircleMarked, BiCheckboxChecked, BiText } from "react-icons/bi"
import { DeleteIcon } from '@chakra-ui/icons'

import { where, doc, onSnapshot, query, collection, orderBy, setDoc, getDoc, getDocs, Timestamp, updateDoc, addDoc, arrayRemove, arrayUnion } from "firebase/firestore";
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
import ProtectedRoute from '../components/ProtectedRoute';
import { Encrypt } from '../utils/cryptography';

import upload_json from '../utils/upload_json';
import Spinner from '../components/Spinner';

function AddQuestions() {
    const navigate = useNavigate();
    const params = useParams()

    const navigator = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [questions, setQuestions] = useState([])
    const [googleFormURL, setGoogleFormURL] = useState("")
    const [isImporting, setIsImporting] = useState(false)
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {

        window.addEventListener('offline', function (e) {
            alert('offline');
        });


        onSnapshot(query(collection(database, `/banks/${params.id}/questions`), orderBy("index")), (doc) => {

            // if (doc.docs.length === 0) {
            //     createNewBank()
            //     console.log("Running")
            // } else {
            setQuestions(doc.docs)
            updateBank('totalQuestions', doc.docs.length)
            // }
        })

    }, [])

    const createNewBank = async () => {
        setShowLoading(true)

        const ref = await addDoc(collection(database, `/banks/${params.id}/questions`), {
            question: "",
            index: questions.length,
            optionType: "One Selection",
            options: [{ optionText: "" }],
            correctOptions: []
        })

        setShowLoading(false)


        updateBank("lastEdit")

        // docRef = doc(database, `/banks/${params.id}/questions/${ref.id}`)
    }

    const updateQuestion = async (id, action, value, extra) => {

        let docRef = doc(database, `/banks/${params.id}/questions/${id}`)

        console.log(id, action, value, extra)

        try {

            setShowLoading(true)

            const docSnap = await getDoc(docRef)

            switch (action) {
                case 'question':
                    await updateDoc(docRef, { question: value })
                    break;
                case "optionType":
                    await updateDoc(docRef, { optionType: value })
                    break
                case "optionText":

                    let optionTexts = docSnap.data().options

                    optionTexts[extra] = { optionText: value }
                    await updateDoc(docRef, { options: optionTexts })

                    break
                case "options":
                    await updateDoc(docRef, { options: [...docSnap.data().options, { optionText: "" }] })
                    break
                case "deleteQuestion":
                    console.log(id)
                    await deleteData(`/banks/${params.id}/questions/${id}`)
                    break
                case "deleteOption":
                    let options = docSnap.data().options
                    options.splice(value, 1)
                    await updateDoc(docRef, { options })
                    break
                case "correctOptions":
                    await updateDoc(docRef, { correctOptions: !docSnap.data().correctOptions.includes(value) ? arrayUnion(value) : arrayRemove(value) })
                    break
                default:
                    break;

            }

            await updateBank("lastEdit")

            setShowLoading(false)


            console.log("Done", value)
        } catch (err) {
            toast.error(err.message, {
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

    const importForm = async () => {
        setIsImporting(true)
        try {
            const _questions = await importGForm(googleFormURL)

            if (questions.length === 1) {

                updateDoc(doc(database, `/banks/${params.id}/questions/${questions[0].id}`), _questions[0]).then(() => _questions.splice(0, 1))
            }

            _questions.forEach((question, index) => {
                if (questions.length >= 1 && index !== 0) {
                    const questionData = question
                    questionData['index'] = index
                    questionData.optionType = "One Selection"
                    questionData.correctOptions = []

                    addDoc(collection(database, `/banks/${params.id}/questions`), questionData).then(() => {
                        updateBank("lastEdit")
                    })
                }

            })

        } catch (err) {
            toast.error(err.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        setIsImporting(false)
        onClose()

    }

    const done = async () => {
        let proceed = true
        setShowLoading(true)
        const vques = await getDocs(query(collection(database, `/banks/${params.id}/questions`), orderBy("index")))
        setQuestions(vques.docs)
        vques.docs.every((question, index) => {
            question.data().options.some((option, optionIndex) => {
                if (option.optionText === "") {
                    toast.error(`Question ${index + 1} Option ${formatOptionIndex(optionIndex)} cant be blank`, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    proceed = false
                    setShowLoading(false)


                    return false
                }
            })


            if (question.data().correctOptions.length === 0) {
                toast.error(`Question ${index + 1} needs correct options`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                proceed = false
                setShowLoading(false)


                return false
            }

            if (question.data().question === "") {
                toast.error(`Question ${index + 1} needs a question`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                proceed = false

                setShowLoading(false)


                return false
            }

            return true
        })

        setShowLoading(false)

        if (proceed) {
            toast.success(`${vques.docs.length} questions uploaded successfully`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => navigate('/dashboard'), 5000)

        }


    }

    const updateBank = async (action, value) => {

        let docRef = doc(database, `/banks/${params.id}`)

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
            case "totalQuestions":
                updateDoc(docRef, { totalQuestions: value })
                break
            default:
                break;
        }

    }

    return (
        <>
            <Title title='Add question' />
            {/* https://docs.google.com/forms/d/e/1FAIpQLSfAR_BRMnb1xnQBkMNHdX5Llh5UNZ-e4mmg75YGCVQ4U598YQ/viewform */}
            <ProtectedRoute>
                <CustomModal
                    onClose={onClose}
                    title="Import Google Form"
                    isOpen={isOpen}
                    onOpen={onOpen}
                    body={`Are you sure you want to delete ?`}
                    isPerfomingAction={isImporting}
                    secondaryAction={importForm}
                    bg='blue.400'
                    bgHover="blue.500"
                    btnText="Import">
                    <Input value={googleFormURL} onChange={(e) => setGoogleFormURL(e.target.value)} placeholder="Enter google form link" />
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

                <NavBar done={done} showLoading={showLoading} updateQuestion={updateQuestion} id={params.id} updateBank={updateBank} onOpen={onOpen} />


                <Box bg={useColorModeValue("gray.50", "inherit")} p={10}>
                    <Box>
                        <chakra.form
                            method="POST"
                            shadow="base"
                            rounded={[null, "md"]}
                            overflow={{ sm: "hidden" }}>
                            <Stack
                                px={4}
                                py={5}
                                bg={useColorModeValue("white", "gray.700")}
                                spacing={6}
                                p={{ sm: 6 }}>
                                <SimpleGrid columns={3} spacing={6}>

                                    {
                                        questions.map((question, index) => <FormControl key={index} as={GridItem} colSpan={[3, 2]}>
                                            <FormLabel
                                                fontSize="25"
                                                fontWeight="bold"
                                            // color={useColorModeValue("gray.700", "gray.50")}
                                            >
                                                Question {index + 1}
                                            </FormLabel>
                                            <InputGroup size="sm">
                                                <InputLeftAddon
                                                    // bg={useColorModeValue("gray.50", "gray.800")}
                                                    // color={useColorModeValue("gray.500", "gay.50")}
                                                    rounded="md">
                                                    {index + 1}
                                                </InputLeftAddon>
                                                <Editable defaultValue={question.data().question} placeholder="Question goes here...">
                                                    <EditablePreview whiteSpace="pre-line" />
                                                    <EditableTextarea
                                                        // noOfLines={question.data().question.length * 8}
                                                        rows={question.data().question.split('\n').length}
                                                        type="tel"
                                                        placeholder="Which of the following is an Algorithm?"
                                                        focusBorderColor="brand.400"
                                                        rounded="md"
                                                        defaultValue={question.data().question}
                                                        onBlur={(event) => updateQuestion(question.id, 'question', event.target.value)}
                                                        onChange={(event) => updateQuestion(question.id, 'question', event.target.value)}

                                                    />
                                                </Editable>
                                                <InputRightAddon size="lg" rounded="lg" bg='white'>
                                                    <HStack>
                                                        <Select
                                                            borderColor="white"
                                                            mt={1}
                                                            focusBorderColor="brand.400"
                                                            shadow="sm"
                                                            _hover={{
                                                                borderColor: "white",
                                                                bg: "gray.400"
                                                            }}
                                                            size="sm"
                                                            w="full"
                                                            rounded="md"
                                                            defaultValue="One Selection"
                                                            onBlur={(event) => updateQuestion(question.id, 'optionType', event.target.value)}
                                                            onChange={(event) => updateQuestion(question.id, 'optionType', event.target.value)}>
                                                            <option>One Selection </option>
                                                            <option>Multiple Selection</option>
                                                            <option>Fill In</option>
                                                        </Select>
                                                        {question.data().optionType === "One Selection" ? <BiRadioCircleMarked size={30} /> : question.data().optionType === "Multiple Selection" ? <BiCheckboxChecked size={30} /> : <BiText size={30} />}
                                                        {
                                                            index !== 0 && <Button
                                                                type="button"
                                                                ml={5}
                                                                variant="solid"
                                                                size="sm"
                                                                fontWeight="medium"
                                                                _focus={{ shadow: "none" }}
                                                                color='white'
                                                                bgColor='red.400'
                                                                _hover={{
                                                                    bgColor: 'red.300',
                                                                }}
                                                                onClick={() => updateQuestion(question.id, "deleteQuestion", "")}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        }
                                                    </HStack>
                                                </InputRightAddon>
                                            </InputGroup>
                                            <br />

                                            <SimpleGrid columns={2} spacing={6} >
                                                {
                                                    question.data().options.map((option, optionIndex) =>
                                                        <GridItem key={optionIndex}>
                                                            <Stack direction='row' >
                                                                <HStack>
                                                                    <InputGroup size='sm'>
                                                                        <InputLeftAddon
                                                                            borderRadius={20}
                                                                            onClick={() => updateQuestion(question.id, "correctOptions", formatOptionIndex(optionIndex))}
                                                                            bg={question.data().correctOptions.includes(formatOptionIndex(optionIndex)) && "green.100"}>
                                                                            <Text>{formatOptionIndex(optionIndex)}){" "}</Text>
                                                                        </InputLeftAddon>
                                                                        {/* <Input defaultValue={option.optionText} onChange={(event) => updateQuestion(question.id, "optionText", event.target.value, optionIndex)} /> */}
                                                                        <Editable defaultValue={option.optionText} placeholder="Enter option" >
                                                                            <EditablePreview marginX={30} />
                                                                            <EditableInput
                                                                                onBlur={(event) => updateQuestion(question.id, "optionText", event.target.value, optionIndex)}
                                                                                onChange={(event) => updateQuestion(question.id, "optionText", event.target.value, optionIndex)} />
                                                                        </Editable>
                                                                    </InputGroup>
                                                                    {optionIndex !== 0 &&
                                                                        <Button
                                                                            type="button"
                                                                            ml={5}
                                                                            variant="solid"
                                                                            size="sm"
                                                                            fontWeight="medium"
                                                                            _focus={{ shadow: "none" }}
                                                                            color='white'
                                                                            bgColor='red.400'
                                                                            _hover={{
                                                                                bgColor: 'red.300'
                                                                            }}
                                                                            onClick={() => updateQuestion(question.id, "deleteOption", optionIndex)}>
                                                                            <DeleteIcon />
                                                                        </Button>
                                                                    }
                                                                </HStack>


                                                                {
                                                                    optionIndex + 1 === question.data().options.length && <Button
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
                                                                        }}
                                                                        onClick={() => updateQuestion(question.id, "options", [])}
                                                                    >
                                                                        <FaPlusCircle />
                                                                    </Button>
                                                                }
                                                            </Stack>

                                                        </GridItem>
                                                    )
                                                }

                                            </SimpleGrid>
                                            <br />
                                            <Text >
                                                Correct options
                                            </Text>
                                            {
                                                question.data().correctOptions.length == 0 && <Text color='red'>* Add or remove correct answers by clicking on the answer letter.</Text>
                                            }
                                            [{
                                                question.data().correctOptions.map((correctOption, correctOptionIndex) => <Text key={correctOption} as='span' >{correctOption} {correctOptionIndex !== question.data().correctOptions.length - 1 && ','} </Text>)
                                            }]


                                        </FormControl>)
                                    }

                                </SimpleGrid>
                                <HStack>
                                    <Text fontSize="25"
                                        fontWeight="bold">Question {questions.length + 1}</Text>
                                    <Button
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
                                        }}
                                        onClick={createNewBank}>
                                        <FaPlusCircle />
                                    </Button>
                                </HStack>

                            </Stack>

                            {/* <Box
                                px={{ base: 4, sm: 6 }}
                                py={3}
                                bg={useColorModeValue("gray.50", "gray.900")}
                                textAlign="right">
                                <Button
                                    onClick={done}
                                    color="blue.400"
                                    _focus={{ shadow: "" }}
                                    fontWeight="md"
                                >
                                    Done
                                </Button>
                            </Box> */}
                        </chakra.form>
                    </Box>
                </Box>
            </ProtectedRoute>
        </>
    );
}

export default AddQuestions


function NavBar({ done, showLoading, id, updateBank, onOpen, updateQuestion }) {

    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');
    const [bankData, setBankData] = useState()

    useEffect(() => {

        onSnapshot(query(doc(database, `/banks/${id}/`)), (doc) => {

            setBankData(doc.data())

        })

    }, [])


    return (
        bankData && <Box
            bgColor="gray.400"
            zIndex={100}
            flex={{ base: 1 }}
            position="fixed"
            w="full"
            justify={{ base: 'center', md: 'start' }}
            // ml={10}
            // bg={useColorModeValue('white', 'gray.800')}
            // color={useColorModeValue('gray.600', 'white')}
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            // borderColor={useColorModeValue('gray.200', 'gray.900')}
            align={'center'}
        >
            <HStack spacing="auto"  >

                <HStack>
                    <Editable defaultValue={bankData.title} placeholder="Bank title" >
                        <EditablePreview />
                        <EditableInput onChange={(event) => updateBank("title", event.target.value)} />
                    </Editable>
                    <Checkbox
                        onChange={(event) => updateBank("isPublic", event.target.checked)}
                        value={!bankData.isPublic}
                        id="isPublic"
                        rounded="md"
                        defaultChecked={bankData.isPublic}>
                        public
                    </Checkbox>
                </HStack>

                <HStack>
                    <Text as="span">
                        Last edit was{" "}

                        <ReactTimeago formatter={timeago_formatter} date={bankData.lastEdit.toDate().toString()} />

                    </Text>

                    {
                        showLoading && <Spinner size={50} />
                    }

                </HStack>


                <HStack>
                    <Button
                        type="button"
                        onClick={done}
                        // onClick={() => { upload_json(id); updateQuestion(id) }}
                        ml={5}
                        variant="solid"
                        size="sm"
                        fontWeight="medium"
                        _focus={{ shadow: "none" }}
                        color='white'
                        bgColor='green.400'
                        _hover={{
                            bgColor: 'blue.300'
                        }}>
                        Verify and upload
                    </Button>
                    <Button
                        type="button"
                        onClick={onOpen}
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
                        Import from Google forms
                    </Button>
                    <Link target="_blank" to={`/questions/${bankData.id}/view?t=${bankData.title}&u=${encodeURIComponent(Encrypt(bankData.user, "exacheer"))}`} state={{ ...bankData }}>
                        <Button
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
                            {/* Import from other questions */}
                            <FaEye />
                        </Button>
                    </Link>
                </HStack>
            </HStack></Box >
    );

}

const DesktopNav = ({ id, updateBank, onOpen }) => {

};