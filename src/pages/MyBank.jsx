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
import { where, onSnapshot, query } from "firebase/firestore";
import { database, banksCollection } from "../utils/firebase"
import BankCard from '../components/BankCard';
import { useNavigate } from "react-router-dom"


export default function MyBank({ userData }) {
    const navigator = useNavigate()
    const [banks, setBanks] = useState([])

    useEffect(() => {

        onSnapshot(query(banksCollection, where("user", "==", userData.email)), (doc) => {
            setBanks(doc.docs)
        })


    })
    return (
        <SimpleGrid columns={3} spacing={6}>
            <GridItem >
                <BankCard isNewCard={true} bank={{}} />
            </GridItem>

            {
                banks.map((bank) =>
                    <GridItem key={bank.id}>
                        <BankCard bank={bank.data()} />
                    </GridItem>
                )
            }

        </SimpleGrid>
    );
}
