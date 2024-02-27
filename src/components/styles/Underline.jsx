const Underline = (props) => {
    return (
        <div className='customUnderline' style={{ textDecoration: "underline" }}>
            {props.children}
        </div>
    )
}

export default Underline