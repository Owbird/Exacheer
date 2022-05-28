import React from 'react'
import Feature from './Feature';


const Features = () => {
    return (
        <section id="features" className="features" data-aos="fade-up">
            <div className="container">

                <div className="section-title">
                    <h2>Features</h2>
                    <p>Exacheer provides amazing features just to suite you</p>
                </div>

                <Feature
                    index={1}
                    fadeDirection='left'
                    title="Unlimited questions"
                    subtitle="Exacheer's technology provides a large pool of questions from other examiners from various institutions.
                    Therefore providing access to unlimited questions on every subject on demand."/>

                <Feature
                    index={2}
                    fadeDirection='right'
                    title="Security"
                    subtitle="Exacheer provides security to exam questions in the following ways"
                    subItems={[
                        'Merging of question banks. With Exacheer, you can select questions from multiple banks and merge them into one exam. Therefore making questions unpredictable. ',
                        "Unique questions can be generated for each student with it's powerful shuffling algorithm together with it's own marking scheme irrespective of the number of students due to its huge question bank.",
                        "Questions on Exacheer can be made private to the uploader, publicly accessible to all examiners or share with specific examiners."
                    ]} />

                <Feature
                    index={3}
                    fadeDirection='left'
                    title="Online exam"
                    subtitle="Exacheer also comes with online exams with amazing features"
                    subItems={[
                        'Unique questions',
                        'Immediate results. Students are provided with their score on completion.',
                        'Online exams provide analytics to provide an insight to how questions are fairing with each student.',
                    ]} />

                <Feature
                    index={4}
                    fadeDirection='right'
                    title="Google Forms"
                    subtitle="Questions can be imported from google forms with just the link."
                    subItems={[
                    ]} />

                <Feature
                    index={5}
                    fadeDirection='left'
                    title="Automation"
                    subtitle="With Exacheer, you tasks are automated to make setting of exam questions easier. The platform comes with these automated tasks"
                    subItems={[
                        'Marking scheme generation. Answers can be exported to either PDFs or Microsoft Word documents.',
                        'Questions can be exported to PDFs or Microsoft Word documents with saved examiner presets.',
                        'Marking. Online quizes are marked automatically.',
                        'Responses can be exported to Excel sheets.'
                    ]} />
                <Feature
                    index={6}
                    fadeDirection='right'
                    title="Cloud based"
                    subtitle="We live in the cloud. Access your work anywhere. Anytime. From any device"
                    subItems={[
                    ]} />

            </div>
        </section>
    )
}

export default Features
