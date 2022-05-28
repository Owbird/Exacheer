import React from 'react'
import { AspectRatio, Text } from "@chakra-ui/react"


const Hero = () => {
    return (
        <section style={{ marginTop: 45 }} id="hero" className="d-flex align-items-center">

            <div className="container d-flex flex-column align-items-center justify-content-center" data-aos="fade-up">
                <h1>
                    <Text as='span' color="yellow.800">Better. </Text>
                    <Text as='span' color="teal">Secure. </Text>
                    <Text as='span' color="pink.300">Fast. </Text>
                    <br />
                    Exams with Exacheer
                </h1>
                <h2>Eliminate the boring process of creating exams while making it secure and keeping it simple.
                    <br />
                    No predictions. Easy marking. Easy collaboration.</h2>
                <a href="/auth" className="btn-get-started scrollto">Get Started</a>
                {/* <img src="assets/img/hero-img.png" className="img-fluid hero-img" alt="" data-aos="zoom-in" data-aos-delay="150" /> */}
                {/* Video goes here */}
                {/* <div style={{ padding: "50% 0 0 0", position: "relative" }}><iframe frameBorder="0" allow="autoPlay; fullscreen;" allowFullScreen style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }} src="https://www.flexclip.com/embed/13565278e86c967cd22f2858305ce603a520878.html" /></div> */}
                <br />
                <br />
                {/* <video
                    style={{
                        borderRadius: 25,
                        marginTop: 25,
                        boxShadow: "5px 10px 10px blue"
                    }}

                    width="700"
                    height="700"
                    id="my-video"
                    className="video-js"
                    controls preload="auto"
                    poster="/assets/img/Exacheer.png"
                    data-setup=''
                    loop>
                    <source
                        src=" https://firebasestorage.googleapis.com/v0/b/exacheer-c9099.appspot.com/o/Exacheer.mp4?alt=media&token=21b314fe-36b1-40dd-af31-989480f718f8"
                        type='video/mp4' />
                </video> */}
                {/* <iframe  width="560" height="315" src="https://www.youtube.com/embed/DQ49w8iJ6n0?controls=0" title="YouTube video player" ="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe> */}


                <iframe style={{
                    borderRadius: 25,
                    marginTop: 25,
                    boxShadow: "5px 10px 10px blue"
                }}

                    width="560"
                    height="315" src="https://www.youtube.com/embed/DQ49w8iJ6n0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>

        </section>
    )
}

export default Hero
