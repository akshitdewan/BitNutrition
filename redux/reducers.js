export default (state = {}, action) => {
    switch (action.type) {
        case "fetchProducts":
            return action.value;
        default:
            return state;
    }
}