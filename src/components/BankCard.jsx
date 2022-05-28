import {
    Heading,
    Box,
    Center,
    Text,
    Stack,
    HStack,
    VStack,
    Button,
    useColorModeValue,

} from '@chakra-ui/react';


import { AES, enc } from 'crypto-js';

import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { FiGlobe, FiEdit, FiClock } from 'react-icons/fi'
import { useDisclosure } from '@chakra-ui/react'
import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { where, doc, onSnapshot, query, collection } from "firebase/firestore";
import { getUserData, database, banksCollection, deleteData } from "../utils/firebase"
import CustomModal from './CustomModal';
import { useNavigate } from 'react-router-dom';
import ReactTimeago from 'react-timeago';
import timeago_formatter from '../utils/timeago_formatter';
import { useCookies } from 'react-cookie';


export default function BankCard({ isNewCard, bank }) {
    const [userData, setUserData] = useState({})
    const [totalQuestions, setTotalQuestions] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cookies, setCookies] = useCookies(['user'])
    const iPosted = userData.email === cookies.user.email

    const navigator = useNavigate()

    useEffect(() => {
        if (!isNewCard) {
            getUserData(bank.user).then((res) => {

                if (res.institution.toLowerCase() === 'exacheer') {
                    res.name = "Exacheer"
                }


                setUserData(res)
            })

            // onSnapshot(collection(database, `/banks/${bank.id}/questions`), (doc) => {
            setTotalQuestions(bank.totalQuestions)
            // })
        }

    }, [])

    const _deleteBank = async () => {
        onClose()
        await deleteData(`/banks/${bank.id}`)
    }
    return (

        < Center py={6}>
            <Box
                maxW={'320px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={(userData.institution && userData.institution.toLowerCase() === "exacheer") && '-50px -25px 50px -12px rgba(242, 185, 116, 0.61)'}
                rounded={'lg'}
                p={6}
                textAlign={'center'}>
                {!isNewCard && <HStack spacing={"auto"}>
                    <HStack>
                        <FiGlobe color="gray" />
                        <Text fontWeight={600} color={'gray.500'} mb={4}>
                            {bank.isPublic ? "Public" : "Private"}
                        </Text>
                    </HStack>
                    <HStack>
                        <FiClock color="gray" />
                        <ReactTimeago formatter={timeago_formatter} date={bank.lastEdit.toDate().toString()} />
                    </HStack>
                </HStack>
                }

                {/* <Link to={isNewCard ? "#" : `/questions/${bank.id}/view?t=${bank.title}&u=${bank.user}`} > */}
                <Link to={isNewCard ? "/questions/init" : `/questions/${bank.id}/view?t=${bank.title}&u=${encodeURIComponent(AES.encrypt(bank.user, "exacheer"))}`} >
                    <Heading marginTop={5} fontSize={'2xl'} fontFamily={'body'}>
                        {isNewCard ? "Add new question" : bank.title}
                    </Heading>

                    {!isNewCard && <>
                        <CustomModal
                            onClose={onClose}
                            title="Delete question bank?"
                            isOpen={isOpen}
                            onOpen={onOpen}
                            secondaryAction={_deleteBank}
                            bg='red'
                            bgHover="red.500"
                            btnText="Delete"
                        >
                            <Text >{`Are you sure you want to delete ${bank.title}?`}</Text>
                        </CustomModal>

                        <Text fontWeight={600} color={'gray.500'} mb={4}>
                            @{userData.name} | {userData.institution}
                        </Text>
                        <Text
                            textAlign={'center'}
                            color="yellow.800"
                            fontSize={25}
                            // color={useColorModeValue('gray.700', 'gray.400')}
                            px={3}>
                            {totalQuestions} question{totalQuestions === 1 ? "" : "s"}
                        </Text>

                    </>
                    }
                </Link>


                {isNewCard ? <Link to="/questions/init" >
                    <Center py={6}>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                                bg: 'blue.500',
                            }}
                            _focus={{
                                bg: 'blue.500',
                            }}>
                            <AddIcon />
                        </Button>
                    </Center>
                </Link> :

                    <>
                        {iPosted && <Stack mt={8} direction={'row'} spacing={4}>
                            <Button
                                onClick={onOpen}

                                flex={1}
                                fontSize={'sm'}
                                bg={'red'}
                                color={'white'}
                                boxShadow={
                                    '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                                }
                                _hover={{
                                    bg: 'red.500',
                                }}
                                _focus={{
                                    bg: 'red.500',
                                }}>
                                <DeleteIcon _hover={{
                                    color: 'white',
                                }} />
                            </Button>

                            <Button
                                onClick={() => navigator(`/questions/${bank.id}/add`)}
                                flex={1}
                                fontSize={'sm'}
                                bg={'blue.400'}
                                color={'white'}
                                boxShadow={
                                    '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                                }
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                _focus={{
                                    bg: 'blue.500',
                                }}>
                                <FiEdit />
                            </Button>
                        </Stack>
                        }
                    </>
                }
            </Box>
        </Center >
    );
}
