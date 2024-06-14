var checkboxElement = document.getElementById('checkbox1');

function Check(checkbox) {
    if (!checkbox.checked) {
        document.getElementById('submit').disabled = true;
        document.getElementById('submit').style.background("grey")

    } else {
        document.getElementById('submit').disabled = false;
        document.getElementById('submit').style.background("blue")
    }
}
//reset form

function isValidEmail(email) {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    let lowerCase = /[a-z]/g;
    let upperCase = /[A-Z]/g;
    let number = /[0-9]/g;

    if (!password.match(lowerCase)) {
        document.getElementById('passwordError').innerHTML = 'There must be at least one lowercase letter';
        return false;
    }
    if (!password.match(upperCase)) {
        document.getElementById('passwordError').innerHTML = 'There must be at least one uppercase letter';
        return false;
    }
    if (!password.match(number)) {
        document.getElementById('passwordError').innerHTML = 'There must be at least one number';
        return false;
    }
    if (password.length < 8) {
        document.getElementById('passwordError').innerHTML = 'There must have at least 8 characters';
        return false;
    }
    return true;
}

function submitForm(event) {
    event.preventDefault(); 
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var agreeTerms = document.getElementById('checkbox1').checked;
    var gender = document.querySelector('input[name="gender"]:checked');
    var country = document.getElementById('country').value;
    var age = document.getElementById('age').value;
    var program = document.querySelector('input[name="program"]:checked');
    var course = document.getElementById('course').value;
    var phoneInput = document.getElementById('phone');
    var phoneError = document.getElementById('phoneError');
    var phoneNumber = phoneInput.value;

    // Reset errors
    var errorElements = document.getElementsByClassName('error');
    for (var i = 0; i < errorElements.length; i++) {
        errorElements[i].innerHTML = '';
    }

    var isValid = true;

    // Name validation
    if (name === '') {
        document.getElementById('nameError').innerHTML = 'Please enter your name';
        isValid = false;
    }

    // Email validation
    if (email === '') {
        document.getElementById('emailError').innerHTML = 'Please enter your email';
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('emailError').innerHTML = 'Please enter a valid email address';
        isValid = false;
    }

    // Password validation
    if (password === '') {
        document.getElementById('passwordError').innerHTML = 'Please enter your password';
        isValid = false;
    } else if (!isValidPassword(password)) {
        isValid = false;
    }

    // Confirm password validation
    if (confirmPassword === '') {
        document.getElementById('confirmPasswordError').innerHTML = 'Please confirm your password';
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').innerHTML = 'Passwords do not match';
        isValid = false;
    }

    // Agree to terms validation
    if (!agreeTerms) {
        document.getElementById('checkboxError').innerHTML = 'Please agree to terms';
        isValid = false;
    }

    // Gender validation
    if (!gender) {
        document.getElementById('genderError').innerHTML = 'Please select your gender';
        isValid = false;
    }
 
    //program
    if (!program) {
        document.getElementById('programError').innerHTML = 'Please select your program';
        isValid = false;
    }

    // Country validation
    if (country === '') {
        document.getElementById('countryError').innerHTML = 'Please select your country';
        isValid = false;
    }

    //age
    if (age === '') {
        document.getElementById('ageError').innerHTML = 'Please select your age';
        isValid = false;
    }


    //phone
    var phoneRegex = /^\d{10}$/; 
    if  (!phoneRegex.test(phoneNumber)) {
        phoneError.textContent = 'Please enter a valid 10-digit phone number';
        return false; 
    } 
    else {
        phoneError.textContent = ''; 
        console.log('Valid phone number:', phoneNumber);
    }

    document.getElementById("myForm").reset()


    //table
    if (isValid) {
        var table = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
        var newRow = table.insertRow(table.rows.length);
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);
        var cell6 = newRow.insertCell(5);
        var cell6 = newRow.insertCell(-1);
        cell1.innerHTML = name;
        cell2.innerHTML = email;
        cell3.innerHTML = gender.value; 
        cell4.innerHTML = age;
        cell5.innerHTML =phoneNumber;
        cell6.innerHTML = program.value+" "+course;
        cell7.innerHTML = country;
        return true;
    }

    return false;

    

    
}

function giveCourse(a) {
    let course = document.getElementById('course');

    if (a.value == 'BE') {

        if (document.getElementById('option1') !== null) {
            for(let i=1; i<5;i++)
            {
                var str = 'option' + i;
                var optio = document.getElementById(str);
                if (optio !== null)
                {
                    optio.parentNode.removeChild(optio);
                }
            }
        }

        let option1 = document.createElement('option');
        option1.setAttribute("id", "option1");
        option1.setAttribute("value", "Computer Science");
        option1.textContent = "Computer Science";
        course.append(option1);

        let option2 = document.createElement('option');
        option2.setAttribute("id", "option2");
        option2.setAttribute("value", "Biochemical Engineering");
        option2.textContent = "Biochemical Engineering";
        course.append(option2);

        let option3 = document.createElement('option');
        option3.setAttribute("id", "option3");
        option3.setAttribute("value", "Mechanical Engineering");
        option3.textContent = "Mechanical Engineering";
        course.append(option3);

        let option4 = document.createElement('option');
        option4.setAttribute("id", "option4");
        option4.setAttribute("value", "Chemical Engineering");
        option4.textContent = "Chemical Engineering";
        course.append(option4);
    } 
    else if (a.value == 'B.Tech') 
    {
        if (document.getElementById('option1') !== null) {
            for(let i=1; i<5;i++)
            {
                var str = 'option' + i;
                var optio = document.getElementById(str);
                if (optio !== null)
                {
                    optio.parentNode.removeChild(optio);
                }
            }
        }

        let option1 = document.createElement('option');
        option1.setAttribute("id", "option1");
        option1.setAttribute("value", "Information Technology");
        option1.textContent = "Information Technology";
        course.append(option1);

        let option2 = document.createElement('option');
        option2.setAttribute("id", "option2");
        option2.setAttribute("value", "AIML");
        option2.textContent = "AIML";
        course.append(option2);

        let option3 = document.createElement('option');
        option3.setAttribute("id", "option3");
        option3.setAttribute("value", "AIDS");
        option3.textContent = "AIDS";
        course.append(option3);

        let option4 = document.createElement('option');
        option4.setAttribute("id", "option4");
        option4.setAttribute("value", "Computer Science and Design");
        option4.textContent = "Computer Science and Design";
        course.append(option4);
    }
}
