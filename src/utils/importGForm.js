import axios from "axios";
import * as cheerio from "cheerio"

export default async function (url) {
    const { data } = await axios.get(`https://thingproxy.freeboard.io/fetch/${url}`);

    const $ = cheerio.load(data)

    const questionData = []
    $('.geS5n').each((index, element) => {
        const question = element.children[0].children[0].children[0].children[0].children[0]

        const temp = { question: "", options: [] }

        if (question) {
            temp.question = question.data
        } else {
            temp.question = ""
        }

        element.children[1].children[1].children[0].children[0].children[0].children.forEach((answerElement) => {
            temp.options.push({ optionText: answerElement.children[0].children[0].children[1].children[0].children[0].children[0].data })
        })

        questionData.push(temp)

    })

    return questionData

}