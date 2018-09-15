import { productsRef } from "../config/firebase";

export const fetchProducts = async dispatch => {
    productsRef.on("value", snapshot => {
        dispatch({
            type: "fetchProducts",
            value: snapshot.val()
        })
    })
};