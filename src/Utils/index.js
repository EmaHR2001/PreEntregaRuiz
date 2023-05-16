export const validate = (product)=>{
    let validate;
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        validate = true;
    }else {
        validate = false;
    }
    return validate;
}