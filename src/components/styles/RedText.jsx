const RedText = (props) => {
    return (
        <div className='RedTextColor' style={{ color: "red" }}>
            {props.children}
        </div>
    )
}

export default RedText