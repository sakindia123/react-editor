const HighlightText = (props) => {
    return (
        <span className='HightlightBlock' style={{
            display: "inline-block",
            background: "#FFC107",
            color: "#ffffff",
            maxHeight: "20px"
        }}>
            {props.children}
        </span>

    )
}

export default HighlightText