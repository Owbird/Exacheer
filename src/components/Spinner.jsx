import React from 'react'
import RingLoader from "react-spinners/RingLoader";
import { css } from "@emotion/react";

const Spinner = ({ size }) => {
    return (
        <RingLoader
            size={size}
            loading={true}
            color="#57cfd2"
            css={css`
                display: block;
                margin: 0 auto;
                border-color: red;
            `} />
    )
}

Spinner.defaultProps = {
    size: 150,
}

export default Spinner
