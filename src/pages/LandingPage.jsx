import React from 'react'
import Title from '../components/Title';
import Hero from '../components/Hero';
import Header from '../components/Header';
import MiniAbout from '../components/MiniAbout';
import Clients from '../components/Clients';
import Features from '../components/Features';
import Spinner from '../components/Spinner';
import CookieCard from '../components/CookieCard';

const LandingPage = () => {
    return (
        <>
            <Title title='Home' />

            {/* <CookieCard /> */}

            <Header />


            <Hero />

            <main id="main">

                <MiniAbout />

                <Clients />

                <Features />

                {/* <section id="pricing" className="pricing section-bg">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>Pricing</h2>
                            <p>Exacheer offers flexible packages to suite everyone</p>
                        </div>

                        <div className="row">

                            <div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="200">
                                <div className="box">
                                    <h3>Free</h3>
                                    <h4><sup>₵</sup>0<span> / month</span></h4>
                                    <ul>
                                        <li>Only 1 question upload</li>
                                        <li>Only 1 Exam creation</li>
                                        <li>Offline exam only</li>
                                        <li>Unlimited public questions</li>
                                 
                                    </ul>
                                    <div className="btn-wrap">
                                        <a href="#" className="btn-buy">Get started</a>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-6 mt-4 mt-md-0" data-aos="zoom-in" data-aos-delay="100">
                                <div className="box featured">
                                    <h3>Personal</h3>
                                    <h4><sup>₵</sup>5<span> / month</span></h4>
                                    <ul>
                                        <li>Unlimited question uploads</li>
                                        <li>Unlimited exam creation</li>
                                        <li>Unlimited online exam</li>
                                    </ul>
                                    <div className="btn-wrap">
                                        <a href="#" className="btn-buy">Get started</a>
                                    </div>
                                </div>
                            </div>

                      

                        </div>

                    </div>
                </section> */}
                {/* <section id="faq" className="faq">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>Frequently Asked Questions</h2>
                        </div>

                        <ul className="faq-list">

                            <li>
                                <div data-bs-toggle="collapse" className="collapsed question" href="#faq1">Non consectetur a erat nam at lectus urna duis? <i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></div>
                                <div id="faq1" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                                    </p>
                                </div>
                            </li>

                            <li>
                                <div data-bs-toggle="collapse" href="#faq2" className="collapsed question">Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque? <i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></div>
                                <div id="faq2" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                    </p>
                                </div>
                            </li>

                            <li>
                                <div data-bs-toggle="collapse" href="#faq3" className="collapsed question">Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi? <i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></div>
                                <div id="faq3" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
                                    </p>
                                </div>
                            </li>

                            <li>
                                <div data-bs-toggle="collapse" href="#faq4" className="collapsed question">Ac odio tempor orci dapibus. Aliquam eleifend mi in nulla? <i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></div>
                                <div id="faq4" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                    </p>
                                </div>
                            </li>

                            <li>
                                <div data-bs-toggle="collapse" href="#faq5" className="collapsed question">Tempus quam pellentesque nec nam aliquam sem et tortor consequat? <i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></div>
                                <div id="faq5" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim suspendisse in est ante in. Nunc vel risus commodo viverra maecenas accumsan. Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis blandit turpis cursus in
                                    </p>
                                </div>
                            </li>

                            <li>
                                <div data-bs-toggle="collapse" href="#faq6" className="collapsed question">Tortor vitae purus faucibus ornare. Varius vel pharetra vel turpis nunc eget lorem dolor? <i className="bi bi-chevron-down icon-show"></i><i className="bi bi-chevron-up icon-close"></i></div>
                                <div id="faq6" className="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Laoreet sit amet cursus sit amet dictum sit amet justo. Mauris vitae ultricies leo integer malesuada nunc vel. Tincidunt eget nullam non nisi est sit amet. Turpis nunc eget lorem dolor sed. Ut venenatis tellus in metus vulputate eu scelerisque. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Nibh tellus molestie nunc non blandit massa enim nec.
                                    </p>
                                </div>
                            </li>

                        </ul>

                    </div>
                </section> */}
                <section id="contact" className="contact section-bg">
                    <div className="container" data-aos="fade-up">

                        <div className="section-title">
                            <h2>Contact</h2>
                            {/* <p>Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.</p> */}
                        </div>

                        <div className="">

                            <div className="">

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="info-box">
                                            <i className="bx bx-map"></i>
                                            <h3>Our Address</h3>
                                            <p>KUMASI, KNUST</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-box mt-4">
                                            <i className="bx bx-envelope"></i>
                                            <h3>Email Us</h3>
                                            <p>info@Exacheer.com</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="info-box mt-4">
                                            <i className="bx bx-phone-call"></i>
                                            <h3>Call Us</h3>
                                            <p>+233 26 554 2141<br />+233 50 133 9986</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* <div className="col-lg-6 mt-4 mt-md-0">
                <form action="forms/contact.php" method="post" role="form" className="php-email-form">
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                    </div>
                    <div className="col-md-6 form-group mt-3 mt-md-0">
                      <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                  </div>
                  <div className="form-group mt-3">
                    <textarea className="form-control" name="message" rows="5" placeholder="Message" required></textarea>
                  </div>
                  <div className="my-3">
                    <div className="loading">Loading</div>
                    <div className="error-message"></div>
                    <div className="sent-message">Your message has been sent. Thank you!</div>
                  </div>
                  <div className="text-center"><button type="submit">Send Message</button></div>
                </form>
              </div> */}

                        </div>

                    </div>
                </section>

            </main>

            <footer id="footer">

                <div className="footer-top">
                    <div className="container">
                        <div className="row">

                            <div className="col-lg-3 col-md-6 footer-contact">
                                <h3>Exacheer</h3>
                                <p>
                                    KUMASI, KNUST
                                    <strong>Phone:</strong> +233 26 554 2141<br />
                                    <strong>Phone:</strong> +233 50 133 9986<br />
                                    <strong>Email:</strong> info@Exacheer.com<br />
                                </p>
                            </div>

                            <div className="col-lg-2 col-md-6 footer-links">
                                <h4>Useful Links</h4>
                                <ul>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#">Home</a></li>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#about">About us</a></li>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#services">Services</a></li>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#">Terms of service</a></li>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#">Privacy policy</a></li>
                                </ul>
                            </div>

                            {/* <div className="col-lg-3 col-md-6 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li><i className="bx bx-chevron-right"></i> <a href="#">Web Design</a></li>
                  <li><i className="bx bx-chevron-right"></i> <a href="#">Web Development</a></li>
                  <li><i className="bx bx-chevron-right"></i> <a href="#">Product Management</a></li>
                  <li><i className="bx bx-chevron-right"></i> <a href="#">Marketing</a></li>
                  <li><i className="bx bx-chevron-right"></i> <a href="#">Graphic Design</a></li>
                </ul>
              </div> */}

                            <div className="col-lg-4 col-md-6 footer-newsletter">
                                <h4>Join Our Newsletter</h4>
                                <p>Lets's keep in touch. Don't miss any update.</p>
                                <form action="" method="post">
                                    <input type="email" name="email" /><input type="submit" value="Subscribe" />
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="container d-md-flex py-4">

                    <div className="me-md-auto text-center text-md-start">
                        <div className="copyright">
                            &copy; Copyright <strong><span>Exacheer</span></strong>. All Rights Reserved
                        </div>

                    </div>
                    <div className="social-links text-center text-md-right pt-3 pt-md-0">
                        <a href="#" className="twitter"><i className="bx bxl-twitter"></i></a>
                        <a href="#" className="facebook"><i className="bx bxl-facebook"></i></a>
                        <a href="#" className="instagram"><i className="bx bxl-instagram"></i></a>
                        <a href="#" className="google-plus"><i className="bx bxl-skype"></i></a>
                        <a href="#" className="linkedin"><i className="bx bxl-linkedin"></i></a>
                    </div>
                </div>
            </footer>

            <div id="preloader">
                <Spinner />
            </div>


            <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>


        </>
    )
}

export default LandingPage
