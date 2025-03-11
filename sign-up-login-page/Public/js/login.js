

const login = async () => {
    let email = document.getElementById('user-email').value;
    let password = document.getElementById('user-password').value;
    let e_message_div = document.getElementById('error-message');
    let error_message = '';

    //fields must not be empty
    if (email == '' || password == '') {
        error_message = '*Please fill all input fields';
        return e_message_div.innerText = error_message;
    }

    //login form data
    const userdata = {
        email,
        password
    }

    await fetch('/login', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(userdata)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message == 'wrong') {
                error_message = '*Email and password combination is incorrect!';
                return e_message_div.innerText = error_message;
            }
            else if (data.message == 'failed') {
                error_message = '*Can not connect to server at this time';
                return e_message_div.innerText = error_message;
            }

            else {

                setTimeout(() => {
                    //redirect to login page
                    window.location = '/Home';
                }, 2000);
            }
        })

}