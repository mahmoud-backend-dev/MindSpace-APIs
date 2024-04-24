function notifications(key) {

    /**
     * notification object
     */
    var obj = {
        "01": {
            key: "walletList",
            title: "Credited to wallet",
            message: " has been credited to your wallet",
        },
        "02": {
            key: "waitlist",
            title: "New reading request",
        },
        "04": {
            key: "startRequest",
            title: "startRequest",
            message: " wants to chat now"
        },
        "05": {
            key: "endReading",
            message: "Reading request has been ended"
        },
        "06": {
            key: "earnings",
            title: "Credited",
            message: " has been credited your account"
        },
        "07": {
            key: "transactionHistory",
            title: "Debited",
            message: " has been debited from your wallet"
        },
        "08": {
            key: "inChat",
            message: " sent a "
        },
        "09": {
            key: "autoLogout",
        },
    }
    return obj[key]
}

module.exports = {
    notifications,
}