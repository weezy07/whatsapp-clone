const getRecipientEmail = (users, userLoggedIn) => {
    let userEmail = users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0]

    return userEmail
}

export default getRecipientEmail
