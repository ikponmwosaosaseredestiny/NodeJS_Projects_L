//sign up user

const sign_up = async () => {
    let fullName = document.getElementById('user-full-name').value;
    let email = document.getElementById('user-email').value;
    let password = document.getElementById('user-password').value;
    let e_message_div = document.getElementById('error-message');
    let error_message = '';

    ///validate front end userinput (sign up)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(email);

    //fields must not be empty
    if (fullName == '' || email == '' || password == '') {
        error_message = '*Please fill all input fields';
        return e_message_div.innerText = error_message;
    }
    // must be valid email
    if (!isValid) {
        error_message = '*Please input a valid email address';
        return e_message_div.innerText = error_message;
    }
    //weak password
    if (password.length < 8) {
        error_message = `*Password is too weak`;
        return e_message_div.innerText = error_message;
    }

    //sign up form is okay, send daata to backend
    const userdata = {
        fullName,
        email,
        password
    }

    await fetch('/', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(userdata)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message == 'already exists') {
                error_message = '*Email address already exists!';
                return e_message_div.innerText = error_message;
            } else {
                //confirm success
                let success_indicator = document.getElementById('registration-success');
                success_indicator.style.display = `block`;
                setTimeout(() => {
                    //redirect to login page
                    window.location = '/login';
                }, 8000);
            }
        })

}