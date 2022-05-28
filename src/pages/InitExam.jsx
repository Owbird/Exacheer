import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Stack,
    Button,
    Checkbox,
    CheckboxGroup,
    chakra,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Formik, Form, Field } from 'formik';

import Title from '../components/Title';

import { saveBank } from '../utils/firebase';
import { v4 as uuid } from 'uuid';

import { useCookies } from 'react-cookie';


export default function InitQuestionBank() {

    const navigator = useNavigate()
    const [cookies] = useCookies(['user'])


    useEffect(() => {
        if (!cookies.user) {
            navigator('/auth')
        }

    })

    const _saveExam = async (values) => {
        const user = cookies.user

        const id = uuid()

        await saveBank({ ...values, user: user.email, id, isExam: true })

        navigator(`/exams/${id}/add`)

    }

    return (
        <>
            <Title title="Create Exam" />
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            Let's create a new exam!
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Formik
                            initialValues={{ title: "" }}
                            onSubmit={async (values, { setSubmitting }) => await _saveExam(values).then(() => setSubmitting(false))}
                        >
                            {({ values, isSubmitting, handleChange }) => <Form>
                                <Stack spacing={4}>
                                    <Box>
                                        <FormControl id="title" isRequired>
                                            <FormLabel id="title">Title</FormLabel>
                                            <Input id="title" onChange={handleChange} value={values.title} type="text" placeholder="Bsc. Computer Science 2 Sem 1 2022" />
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
                                            loadingText="Submitting"
                                            type="submit"
                                            isLoading={isSubmitting}
                                            size="lg"
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}>
                                            Proceed
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Form>}
                        </Formik>
                    </Box>
                </Stack>
            </Flex>
        </>
    );
}
