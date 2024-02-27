const Bold = (props) => {
    return (
        <div className='customBold' style={{ fontWeight: "bold" }}>
            {props.children}
        </div>
    )
}

export default Bold