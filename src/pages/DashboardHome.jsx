import React from 'react'
import { SimpleGrid, GridItem } from '@chakra-ui/layout'
import { useEffect, useState } from "react"
import { where, onSnapshot, query, collection, orderBy, OrderByDirection } from "firebase/firestore";
import { database, banksCollection } from "../utils/firebase"
import BankCard from '../components/BankCard';

const DashboardHome = () => {
    const [banks, setBanks] = useState([])

    useEffect(() => {
        onSnapshot(query(collection(database, '/banks/'), where('isPublic', '==', true), orderBy('lastEdit', 'desc')), (doc) => {
            setBanks(doc.docs)
        })
    }, [])
    return (
        <SimpleGrid columns={3} spacing={6}>

            {
                banks.map((bank) =>
                    <GridItem key={bank.id}>
                        <BankCard bank={bank.data()} />
                    </GridItem>
                )
            }

        </SimpleGrid>
    )
}

export default DashboardHome
