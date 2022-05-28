import { Button, Image } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const Feature = ({
    index,
    fadeDirection,
    title,
    subtitle,
    subItems,
}) => {
    return (
        <div className="row content">
            <div className="col-md-5" data-aos={`fade-${fadeDirection === 'left' ? 'right' : 'left'}`} data-aos-delay="100">
                <Image borderRadius={20} src={`assets/img/features/feature-${index}.png`} className="img-fluid" alt="" />
            </div>
            <div className="col-md-7 pt-4" data-aos={`fade-${fadeDirection}`} data-aos-delay="100">
                <h3>{title}</h3>
                <p className="fst-italic">{subtitle}</p>
                <ul>
                    {
                        subItems && subItems.map((item, index) => <li key={index}><i className="bi bi-check"></i>{item}</li>)
                    }
                </ul>
                <br />
                <a href="/auth" >
                    <Button type="button"
                        ml={5}
                        variant="solid"
                        size="sm"
                        fontWeight="medium"
                        _focus={{ shadow: "none" }}
                        color='white'
                        bgColor='rgb(59, 78, 248)'
                        _hover={{
                            bgColor: 'blue.300'
                        }}>
                        Get Started
                        <i className="bx bx-chevron-right"></i>
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default Feature
