import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    Avatar,
    AvatarGroup,
    useBreakpointValue,
    FormControl,
    FormLabel,
    Select,
    Icon,
} from '@chakra-ui/react';

import { getUserData, signOut, uploadFile } from '../utils/firebase';


import { Form, Formik } from 'formik';

import { useState, useEffect } from 'react';

import { authenticate, submitUserData } from '../utils/firebase'
import { onAuthStateChanged } from "@firebase/auth";
import { authentication } from "../utils/firebase";

import { useNavigate } from "react-router-dom"

import Spinner from '../components/Spinner';
import Title from '../components/Title';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useCookies } from 'react-cookie';

export default function AuthPage() {
    const navigator = useNavigate()

    const breakPointValue = useBreakpointValue({ base: '44px', md: '60px' })
    const [cookies, setCookies] = useCookies(['user'])

    useEffect(() => {

        if (cookies.user) {
            navigator('/verification/')
        }

    })


    const avatars = [
        {
            name: 'KNUST',
            url: 'https://ik.imagekit.io/exacheer/knust-logo_dDxPWZQHc.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729854267',
        },
        {
            name: 'UG',
            url: 'https://ik.imagekit.io/exacheer/ug-logo_gWqa2DMi2.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729854306',
        },

    ];

    const [authType, setAuthType] = useState("SIGNUP")

    const toggleAuthType = () => {
        setAuthType(authType === "SIGNUP" ? "LOGIN" : "SIGNUP")
    }

    const handleAuth = async (values, isSignUp) => {

        const res = await authenticate(values, isSignUp)

        if (res['error']) {

            toast.error(res['error'], {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            if (isSignUp) {
                uploadFile(values.examinerID, values.email).then(async (examinerID) => {

                    await submitUserData({ ...values, examinerID })
                }).catch((err) => {
                    console.log("from upload")
                    toast.error(err.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
            }


            getUserData(values.email).then((res) => {
                if (res.err) {
                    toast.error(res.err, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                } else {
                    console.log(res, "from get user data")
                    setCookies('user', res, { path: '/' })
                    navigator('/verification/')
                }
            }).catch((err) => {
                console.log("from get user data")
                toast.error(err.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            })

        }

    }


    return (
        <>
            <Title title="Auth" />
            <Box position={'relative'}>
                <Container
                    as={SimpleGrid}
                    maxW={'7xl'}
                    columns={{ base: 1, md: 2 }}
                    spacing={{ base: 10, lg: 32 }}
                    py={{ base: 10, sm: 20, lg: 32 }}>
                    <Stack spacing={{ base: 10, md: 20 }}>
                        <Heading
                            lineHeight={1.1}
                            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                            <Text
                                color='yellow.800'>
                                Examiners ,
                            </Text>
                            {' '}
                            <Text
                                color='teal'>
                                Lecturers ,
                            </Text>
                            {' '}
                            <Text
                                color='pink.300'>
                                Teachers .
                            </Text>
                        </Heading>
                        <Stack direction={'row'} spacing={4} align={'center'}>
                            <AvatarGroup>
                                {avatars.map((avatar) => (
                                    <Avatar
                                        key={avatar.name}
                                        name={avatar.name}
                                        src={avatar.url}
                                        position={'relative'}
                                        zIndex={2}
                                        _before={{
                                            content: '""',
                                            width: 'full',
                                            height: 'full',
                                            rounded: 'full',
                                            transform: 'scale(1.125)',
                                            bgGradient: 'linear(to-bl, blue.700,blue.900)',
                                            position: 'absolute',
                                            zIndex: -1,
                                            top: 0,
                                            left: 0,
                                        }}
                                    />
                                ))}
                            </AvatarGroup>
                            <Text fontFamily={'heading'} fontSize={{ base: '4xl', md: '6xl' }}>
                                +
                            </Text>
                            <Flex
                                align={'center'}
                                justify={'center'}
                                fontFamily={'heading'}
                                fontSize={{ base: 'sm', md: 'lg' }}
                                bg={'gray.800'}
                                color={'white'}
                                rounded={'full'}
                                width={breakPointValue}
                                height={breakPointValue}
                                position={'relative'}
                                _before={{
                                    content: '""',
                                    width: 'full',
                                    height: 'full',
                                    rounded: 'full',
                                    transform: 'scale(1.125)',
                                    bgGradient: 'linear(to-bl, orange.400,yellow.400)',
                                    position: 'absolute',
                                    zIndex: -1,
                                    top: 0,
                                    left: 0,
                                }}>
                                YOU
                            </Flex>
                        </Stack>
                    </Stack>
                    <Stack
                        bg={'gray.50'}
                        rounded={'xl'}
                        p={{ base: 4, sm: 6, md: 8 }}
                        spacing={{ base: 8 }}
                        maxW={{ lg: 'lg' }}>
                        <Stack spacing={4}>
                            <Heading
                                color={'gray.800'}
                                lineHeight={1.1}
                                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                                {authType === "SIGNUP" ? "Join" : "Welcome back to "} the community
                                <Text
                                    as={'span'}
                                    bgGradient="linear(to-r, blue.700,blue.900)"
                                    bgClip="text">
                                    !
                                </Text>
                            </Heading>
                            {authType === "SIGNUP" && <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                                Your account will be inactive till it's verified from your institution.
                            </Text>}
                        </Stack>
                        <Box mt={10}>
                            <Formik
                                initialValues={{ name: "", email: "", number: "", institution: "", password: "", examinerID: undefined }}
                                onSubmit={async (values, { setSubmitting }) => await handleAuth(values, authType === "SIGNUP").then(() => setSubmitting(false))}>
                                {({ values, isSubmitting, handleChange }) => (
                                    <Form>
                                        <Stack spacing={4}>
                                            <FormControl id="name" isRequired >
                                                {authType === "SIGNUP" && <Input
                                                    placeholder="Name"
                                                    bg={'gray.100'}
                                                    border={0}
                                                    color={'gray.500'}
                                                    _placeholder={{
                                                        color: 'gray.500',
                                                    }}
                                                    value={values.name}
                                                    onChange={handleChange}
                                                />}
                                            </FormControl>
                                            <FormControl id="email" isRequired>
                                                <Input
                                                    placeholder="Email"
                                                    type="email"
                                                    bg={'gray.100'}
                                                    border={0}
                                                    color={'gray.500'}
                                                    _placeholder={{
                                                        color: 'gray.500',
                                                    }}
                                                    value={values.email}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>

                                            {authType === "SIGNUP" && <FormControl id="number" isRequired>
                                                <Input
                                                    placeholder="Number"
                                                    bg={'gray.100'}
                                                    border={0}
                                                    color={'gray.500'}
                                                    _placeholder={{
                                                        color: 'gray.500',
                                                    }}
                                                    value={values.number}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>}
                                            {authType === "SIGNUP" && <>
                                                <FormControl id="institution" isRequired>
                                                    <Select placeholder='Select institution'
                                                        color={'gray.500'}
                                                        bg={'gray.100'}
                                                        value={values.institution}
                                                        onChange={handleChange}>

                                                        <option value='knust'>KNUST</option>
                                                        <option value='UG'>University of Ghana</option>
                                                        <option value='Other'>Other</option>
                                                    </Select>
                                                </FormControl>
                                                <FormControl id="examinerID" isRequired>
                                                    <FormLabel color="gray.500" id="examinerID">Upload your examiner ID</FormLabel>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        id="examinerID"
                                                        placeholder="Number"
                                                        bg={'gray.100'}
                                                        border={0}
                                                        color={'gray.500'}
                                                        _placeholder={{
                                                            color: 'gray.500',
                                                        }}
                                                        // value={values.examinerID}
                                                        onChange={(e) => { values.examinerID = e.target.files[0]; }}
                                                    />
                                                </FormControl>
                                            </>
                                            }
                                            <FormControl id="password" isRequired>
                                                <Input
                                                    placeholder="password"
                                                    bg={'gray.100'}
                                                    border={0}
                                                    type="password"
                                                    color={'gray.500'}
                                                    _placeholder={{
                                                        color: 'gray.500',
                                                    }}
                                                    value={values.password}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                            {/* <Button fontFamily={'heading'} bg={'gray.200'} color={'gray.800'}>
                                Upload CV
                            </Button> */}
                                        </Stack>
                                        <Button
                                            fontFamily={'heading'}
                                            mt={8}
                                            type='submit'
                                            w={'full'}
                                            bgGradient="linear(to-r, blue.700,blue.900)"
                                            color={'white'}
                                            _hover={{
                                                bgGradient: 'linear(to-r, blue.700,blue.900)',
                                                boxShadow: 'xl',
                                            }}
                                            isLoading={isSubmitting}
                                        >
                                            Submit
                                        </Button>
                                        <ToastContainer position="bottom-right"
                                            autoClose={5000}
                                            hideProgressBar={false}
                                            newestOnTop={false}
                                            closeOnClick
                                            rtl={false}
                                            pauseOnFocusLoss
                                            draggable
                                            pauseOnHover />

                                    </Form>
                                )}
                            </Formik>
                            <br />
                            <Text as={'button'} onClick={toggleAuthType} align='center' color={'teal'} fontSize={{ base: 'sm', sm: 'md' }}>
                                {authType === "SIGNUP" ? "Login" : "Sign up"} instead
                            </Text>
                        </Box>

                    </Stack>
                </Container>
            </Box></>
    );
}

