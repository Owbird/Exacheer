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
    const imgs = {
        1: "https://ik.imagekit.io/exacheer/feature-1_xJIs0dDSr.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729472856",
        2: "https://ik.imagekit.io/exacheer/feature-2_PtbjrsRGY.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729472641",
        3: "https://ik.imagekit.io/exacheer/feature-3_ZijbvzduB.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729464780",
        4: "https://ik.imagekit.io/exacheer/feature-4_cETIXJvBZ.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729464698",
        5: "https://ik.imagekit.io/exacheer/feature-5_aKOUHmadSF.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729473022",
        6: "https://ik.imagekit.io/exacheer/feature-6_yeGr_oPt0.png?ik-sdk-version=javascript-1.4.3&updatedAt=1653729465240"
    }
    return (
        <div className="row content">
            <div className="col-md-5" data-aos={`fade-${fadeDirection === 'left' ? 'right' : 'left'}`} data-aos-delay="100">
                <Image borderRadius={20} src={imgs[index]} className="img-fluid" alt="" />
                {/* <Image borderRadius={20} src={`assets/img/features/feature-${index}.png`} className="img-fluid" alt="" /> */}
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
