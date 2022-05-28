import React, { useState, useEffect } from 'react';
import { Workbook, Column, Sheet } from 'react-excel-workbook'
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
    VStack,
    Checkbox,
    CheckboxGroup,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useBreakpointValue,
    useDisclosure,
    ButtonGroup,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsBoxArrowUpRight, BsFillTrashFill } from "react-icons/bs";

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

import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';

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

import CopyToClipboard from 'react-copy-to-clipboard';

const ExamStats = () => {
    const params = useParams()
    const [examData, setexamData] = useState()
    const [responses, setResponses] = useState()

    useState(() => {
        getDoc(query(doc(database, `/exams/${params.id}/`))).then((doc) => {
            setexamData(doc.data())
        })

        getDocs(query(collection(database, `/exams/${params.id}/responses`))).then((docs) => {
            // setexamData(doc.data())
            setResponses(docs.docs)
        })
    }, [])


    return (
        <>
            <ProtectedRoute>
                <Title title="Exam Statistics" />
                <NavBar id={params.id} examData={examData} />
                {responses && <ResultsTable id={params.id} responses={responses} examData={examData} />}


            </ProtectedRoute>
        </>
    )
}

export default ExamStats


function NavBar({ id, updateBank, onOpen, examData, copyLink }) {

    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');
    const location = useLocation()
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
            <ToastContainer position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
            <HStack spacing="auto"  >
                <HStack>
                    <Editable defaultValue={examData.title} placeholder="Bank title" >
                        <EditablePreview />
                        <EditableInput readOnly={true} />
                    </Editable>
                </HStack>

                <Text as="span">
                    Last edit was{" "}

                    <ReactTimeago formatter={timeago_formatter} date={examData.lastEdit.toDate().toString()} />

                </Text>

                <CopyToClipboard
                    text={`${window.location.toString().replace("stats", "")}online`}
                    onCopy={() => toast.success("Link copied!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })}
                >

                    <VStack
                        borderRadius={20}
                        bgColor="gray.100"
                        borderColor="blue.400"
                        borderWidth="1px"
                        padding={3}>

                        {/* <Text >
                            {`${window.location.toString().replace("stats", "")}online`}

                        </Text> */}

                        <Text size={2} color="gray">
                            Click to copy exam link
                        </Text>
                    </VStack>
                </CopyToClipboard>


            </HStack></Box >
    );

}

function ResultsTable({ responses, examData, id }) {
    const header = ["#", "Index Number", "Score", "Alternate", "actions"];

    const color1 = useColorModeValue("gray.400", "gray.400");
    const color2 = useColorModeValue("gray.400", "gray.400");


    const [responseData, setResponseData] = useState([])

    useEffect(() => {
        let res = []
        responses.forEach((response) => {

            const data = response.data()

            if (!data.totalScore) {
                data.totalScore = "Pending"
            } else {
                data.totalScore = `${data.totalScore}`
            }

            res.push({
                indexNumber: data.indexNumber,
                totalScore: data.totalScore,
                alt: "Alt " + data.alt.toString()
            })

            setResponseData(res)
        })
    }, [])

    return (
        <Flex
            w="full"
            bg="gray.600"
            p={50}
            alignItems="center"
            justifyContent="center"
        >
            <Table
                w="full"
                bg={useColorModeValue("white", "gray.800")}
                display={{
                    base: "block",
                    md: "table",
                }}
                sx={{
                    "@media print": {
                        display: "table",
                    },
                }}
            >
                <Thead
                    display={{
                        base: "none",
                        md: "table-header-group",
                    }}
                    sx={{
                        "@media print": {
                            display: "table-header-group",
                        },
                    }}
                >
                    <Tr>
                        {header.map((x) => (
                            <Th key={x}>{x}</Th>
                        ))}
                        <Th>

                            <Workbook filename={`${examData.title}-responses.xlsx`} element={<Button>
                                Export
                            </Button>}>
                                <Sheet data={responseData} name="Sheet A">
                                    <Column label="Index Number" value="indexNumber" />
                                    <Column label="Score" value="totalScore" />
                                    <Column label="Alternate" value="alt" />
                                </Sheet>

                            </Workbook>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody
                    display={{
                        base: "block",
                        lg: "table-row-group",
                    }}
                    sx={{
                        "@media print": {
                            display: "table-row-group",
                        },
                    }}
                >
                    {responseData.map((token, tid) => {
                        return (
                            <Tr
                                key={token.id}
                                display={{
                                    base: "grid",
                                    md: "table-row",
                                }}
                                sx={{
                                    "@media print": {
                                        display: "table-row",
                                    },
                                    gridTemplateColumns: "minmax(0px, 35%) minmax(0px, 65%)",
                                    gridGap: "10px",
                                }}
                            >
                                <Td
                                    color={"gray.500"}
                                    fontSize="md"
                                    fontWeight="hairline"
                                >

                                    {tid + 1}
                                </Td>


                                <Td
                                    color={"gray.500"}
                                    fontSize="md"
                                    fontWeight="hairline"
                                >

                                    {token.indexNumber}
                                </Td>

                                <Td
                                    color={"gray.500"}
                                    fontSize="md"
                                    fontWeight="hairline"
                                >
                                    {token.totalScore}
                                </Td>

                                <Td
                                    color={"gray.500"}
                                    fontSize="md"
                                    fontWeight="hairline"
                                >
                                    {token.alt}
                                </Td>


                                <Td>
                                    <ButtonGroup variant="solid" size="sm" spacing={3}>
                                        <Link
                                            target='_blank'
                                            to={`/questions/${id}/view?w=r&a=${token.alt}&t=${examData.title} Alt ${token.alt}&u=${encodeURIComponent(AES.encrypt(token.indexNumber, "exacheer"))}`}
                                        >

                                            <IconButton
                                                colorScheme="blue"
                                                icon={<BsBoxArrowUpRight />}
                                            />
                                        </Link>
                                        {/* <IconButton colorScheme="green" icon={<AiFillEdit />} />
                                        <IconButton
                                            colorScheme="red"
                                            variant="outline"
                                            icon={<BsFillTrashFill />}
                                        /> */}
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Flex>
    );

}