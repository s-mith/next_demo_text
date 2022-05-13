

const  ItemTag =  ({name, value, passedClassName}) => {
    return (
            <div className={passedClassName}>
                <span >{name}</span>: <span>{value}</span>
            </div>
    )
}

export default ItemTag