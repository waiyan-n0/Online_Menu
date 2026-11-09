const Msg = (res, msg='', result={}) =>{
    return res.status(200).json({con:true, msg:msg, result:result});
}

module.exports = {
    Msg,
}