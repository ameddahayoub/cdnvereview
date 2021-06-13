var sessionUser;
var monthNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var dateObj = new Date();
var month = monthNames[dateObj.getMonth()];
var day = String(dateObj.getDate()).padStart(2, '0');
var year = dateObj.getFullYear();
var minutes = dateObj.getMinutes();
var seconds = dateObj.getSeconds();
var hours = dateObj.getHours();
var output = month + '/' + day + '/' + year + '-' + hours + ':' + minutes + ':' + seconds;
var sessionUserEvaluate = '';
var companyName = document.getElementsByClassName("box-rate")[0].id;
var apiUrl = "https://vereview.appspot.com";
document.onreadystatechange = (function() {
    if (isCompanyExist(companyName) != "true") {
        document.querySelector(".box-rate").innerHTML = goHome();
    } else if (isCompanyExist(companyName) == "true") {
        document.querySelector(".box-rate").innerHTML = userNotExist();
        document.getElementById("addF").onclick = async function(e) {
            firebase.initializeApp(firebaseConfig);
            firebase.analytics();
            const auth = firebase.auth();
            const db = firebase.firestore();
            e.preventDefault();
            var star_content = document.querySelector('.star-text').textContent;
            var star = "";
            if (star_content == "1 star: Bad") {
                star = "1";
            } else if (star_content == "2 star: Poor") {
                star = "2";
            } else if (star_content == "3 star: Average") {
                star = "3";
            } else if (star_content == "4 star: Great") {
                star = "4";
            } else if (star_content == "5 star: Excellent") {
                star = "5";
            }
            var title = document.getElementById("title").value;
            var body = document.getElementById("body").value;
            if (title == '' && body == '') {
                document.querySelector(".error-title").innerHTML = '';
                document.querySelector(".error-body").innerHTML = '';
                document.querySelector(".error-title").innerHTML = 'Please enter your title';
                document.querySelector(".error-body").innerHTML = 'Please enter your review';
            } else if (title == '') {
                document.querySelector(".error-title").innerHTML = '';
                document.querySelector(".error-body").innerHTML = '';
                document.querySelector(".error-title").innerHTML = 'Please enter your title';
            } else if (body == '') {
                document.querySelector(".error-title").innerHTML = '';
                document.querySelector(".error-body").innerHTML = '';
                document.querySelector(".error-body").innerHTML = 'Please enter your review';
            } else if (title != '' && body != '') {
                document.querySelector(".error-title").innerHTML = '';
                document.querySelector(".error-body").innerHTML = '';
                var usercheck = await db.collection('USERS').where('email', '==', document.getElementById("email").value).get();
                if (usercheck.docs.length == 0) {
                    var email = document.getElementById("email").value;
                    var password = document.getElementById("password").value;
                    var user = "";
                    var uid = "";
                    if (email == '' || password == '') {
                        document.querySelector(".error").innerHTML = '';
                        document.querySelector(".error").innerHTML = 'Please fill the form bellow';
                    } else if (email != '' && password != '') {
                        document.querySelector(".error").innerHTML = '';
                        document.querySelector(".formSignup").style.display = 'block';
                        document.querySelector(".primary").style.display = 'none';
                        document.querySelector(".secondry").style.display = 'block';
                        document.getElementById("addS").onclick = async function(e) {
                            var firstName = document.getElementById("firstName").value;
                            var lastName = document.getElementById("lastName").value;
                            if (firstName == '' && lastName == '') {
                                document.querySelector(".error-fName").innerHTML = '';
                                document.querySelector(".error-lName").innerHTML = '';
                                document.querySelector(".error-fName").innerHTML = 'Please enter you first Name';
                                document.querySelector(".error-lName").innerHTML = 'Please enter you last Name';
                            } else if (firstName == '') {
                                document.querySelector(".error-fName").innerHTML = '';
                                document.querySelector(".error-lName").innerHTML = '';
                                document.querySelector(".error-fName").innerHTML = 'Please enter you first Name';
                            } else if (lastName == '') {
                                document.querySelector(".error-fName").innerHTML = '';
                                document.querySelector(".error-lName").innerHTML = '';
                                document.querySelector(".error-lName").innerHTML = 'Please enter you last Name';
                            } else if (firstName != '' && lastName != '') {
                                document.querySelector(".error-fName").innerHTML = '';
                                document.querySelector(".error-lName").innerHTML = '';
                                auth.createUserWithEmailAndPassword(email, password).then(cred => {
                                    return user = cred.user.email,
                                        uid = cred.user.uid,
                                        db.collection('USERS').doc(cred.user.uid).set({
                                            email: email,
                                            password: password,
                                            firstName: firstName,
                                            lastName: lastName,
                                            birthday: null,
                                            dateCreation: output,
                                            disableAccount: false,
                                            phoneNumber: "",
                                            profilePicture: ""
                                        });
                                }).then(() => {
                                    var myVar = JSON.stringify({ company: companyName, star: star, title: title, body: body, user: user, uid: uid });
                                    console.log(myVar);
                                    chekReview(uid, myVar);
                                }).catch((error) => {
                                    document.querySelector(".error").innerHTML = error.message;
                                });
                            }
                        };
                    }
                } else {
                    var email = document.getElementById("email").value;
                    var password = document.getElementById("password").value;
                    auth.signInWithEmailAndPassword(email, password).then(cred => {
                        var myVar = JSON.stringify({ company: companyName, star: star, title: title, body: body, user: cred.user.email, uid: cred.user.uid });
                        console.log(myVar);
                        chekReview(cred.user.uid, myVar);
                        signupForm.querySelector('.error').innerHTML = '';
                    }).catch(function(error) {
                        document.querySelector(".error").innerHTML = '';
                        document.querySelector(".error").innerHTML = error.message;
                    });
                }
            }
        };
    }
});

function isCompanyExist(companyName) {
    var xhttp = new XMLHttpRequest();
    var exist;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            exist = this.responseText;
        }
    };
    xhttp.open("GET", apiUrl + "/isCompanyExist?company=" + companyName, false);
    xhttp.send();
    return exist;
}

function addReview(myVar) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", apiUrl + "/evaluate?jsonData=" + myVar);
    xhttp.send();
}

function chekReview(uid, myVar) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "false") {
                addReview(myVar);
            } else {
                document.querySelector(".box-rate").innerHTML = '';
                document.querySelector(".box-rate").innerHTML = goProfile();
            }
        }
    };
    xhttp.open("GET", apiUrl + "/isReviewExist?uid=" + uid + "&company=" + companyName);
    xhttp.send();

}

function starmarkIN(item) {
    var onStar = parseInt(item.getAttribute("data-value"), 10);
    var stars = document.querySelectorAll("span.star");
    if (stars[0].getAttribute("data-name") == 'bad') {
        stars[0].classList.remove('star-bad');
    } else if (stars[0].getAttribute("data-name") == 'poor') {
        stars[0].classList.remove('star-poor');
        stars[1].classList.remove('star-poor');
    } else if (stars[0].getAttribute("data-name") == 'average') {
        stars[0].classList.remove('star-average');
        stars[1].classList.remove('star-average');
        stars[2].classList.remove('star-average');
    } else if (stars[0].getAttribute("data-name") == 'great') {
        stars[0].classList.remove('star-great');
        stars[1].classList.remove('star-great');
        stars[2].classList.remove('star-great');
        stars[3].classList.remove('star-great');
    } else if (stars[0].getAttribute("data-name") == 'excellent') {
        stars[0].classList.remove('star-excellent');
        stars[1].classList.remove('star-excellent');
        stars[2].classList.remove('star-excellent');
        stars[3].classList.remove('star-excellent');
        stars[4].classList.remove('star-excellent');
    }
    for (i = 0; i < onStar; i++) {
        if (i == 0) {
            document.querySelector('.star-text').textContent = "1 star: Bad";
            stars[i].classList.add('hover1');
        } else if (i == 1) {
            document.querySelector('.star-text').textContent = "2 star: Poor";
            stars[i - 1].classList.add('hover2');
            stars[i].classList.add('hover2');
        } else if (i == 2) {
            document.querySelector('.star-text').textContent = "3 star: Average";
            stars[i - 2].classList.add('hover3');
            stars[i - 1].classList.add('hover3');
            stars[i].classList.add('hover3');
        } else if (i == 3) {
            document.querySelector('.star-text').textContent = "4 star: Great";
            stars[i - 3].classList.add('hover4');
            stars[i - 2].classList.add('hover4');
            stars[i - 1].classList.add('hover4');
            stars[i].classList.add('hover4');
        } else if (i == 4) {
            document.querySelector('.star-text').textContent = "5 star: Excellent";
            stars[i - 4].classList.add('hover5');
            stars[i - 3].classList.add('hover5');
            stars[i - 2].classList.add('hover5');
            stars[i - 1].classList.add('hover5');
            stars[i].classList.add('hover5');
        }
    }
}

function starmarkOUT(item) {
    var x = document.querySelectorAll("span.star");
    var onStar = parseInt(item.getAttribute("data-value"), 10);
    for (i = 0; i < onStar; i++) {
        x[i].classList.remove('hover1');
        x[i].classList.remove('hover2');
        x[i].classList.remove('hover3');
        x[i].classList.remove('hover4');
        x[i].classList.remove('hover5');
        x[i].classList.remove('star-bad');
        x[i].classList.remove('star-poor');
        x[i].classList.remove('star-average');
        x[i].classList.remove('star-great');
        x[i].classList.remove('star-excellent');
    }
    if (x[0].getAttribute("data-name") == 'bad') {
        x[0].classList.add('star-bad');
        document.querySelector('.star-text').textContent = "1 star: Bad";
    } else if (x[0].getAttribute("data-name") == 'poor') {
        x[1].classList.add('star-poor');
        x[0].classList.add('star-poor');
        document.querySelector('.star-text').textContent = "2 star: Poor";
    } else if (x[0].getAttribute("data-name") == 'average') {
        x[2].classList.add('star-average');
        x[1].classList.add('star-average');
        x[0].classList.add('star-average');
        document.querySelector('.star-text').textContent = "3 star: Average";
    } else if (x[0].getAttribute("data-name") == 'great') {
        x[3].classList.add('star-great');
        x[2].classList.add('star-great');
        x[1].classList.add('star-great');
        x[0].classList.add('star-great');
        document.querySelector('.star-text').textContent = "4 star: Great";
    } else if (x[0].getAttribute("data-name") == 'excellent') {
        x[4].classList.add('star-excellent');
        x[3].classList.add('star-excellent');
        x[2].classList.add('star-excellent');
        x[1].classList.add('star-excellent');
        x[0].classList.add('star-excellent');
        document.querySelector('.star-text').textContent = "5 star: Excellent";
    } else if (x[0].getAttribute("data-name") == 'none') {
        document.querySelector('.star-text').textContent = "Roll over stars, then click to rate";
    }
}

function starmark(item) {
    var firebaseAppScript = document.createElement('script');
    firebaseAppScript.setAttribute('src', 'https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
    document.head.appendChild(firebaseAppScript);
    var firebaseAnalyticsScript = document.createElement('script');
    firebaseAnalyticsScript.setAttribute('src', 'https://www.gstatic.com/firebasejs/7.14.1/firebase-analytics.js');
    document.head.appendChild(firebaseAnalyticsScript);
    var firebaseAuthScript = document.createElement('script');
    firebaseAuthScript.setAttribute('src', 'https://www.gstatic.com/firebasejs/7.14.1/firebase-auth.js');
    document.head.appendChild(firebaseAuthScript);
    var firebaseFirestoreScript = document.createElement('script');
    firebaseFirestoreScript.setAttribute('src', 'https://www.gstatic.com/firebasejs/7.14.1/firebase-firestore.js');
    document.head.appendChild(firebaseFirestoreScript);
    document.querySelector('.body-review').style.display = 'block';
    var onStar = parseInt(item.getAttribute("data-value"), 10);
    var stars = document.querySelectorAll("span.star");
    stars[0].setAttribute('bool', 'true');
    for (i = 0; i < stars.length; i++) {
        stars[i].classList.add('star-none');
    }
    if (onStar == 1) {
        stars[0].setAttribute('data-name', 'bad');
        stars[0].classList.add('star-bad');
        document.querySelector('.star-text').textContent = "1 star: Bad";
    } else if (onStar == 2) {
        stars[0].setAttribute('data-name', 'poor');
        stars[1].classList.add('star-poor');
        stars[0].classList.add('star-poor');
        document.querySelector('.star-text').textContent = "2 star: Poor";
    } else if (onStar == 3) {
        stars[0].setAttribute('data-name', 'average');
        stars[2].classList.add('star-average');
        stars[1].classList.add('star-average');
        stars[0].classList.add('star-average');
        document.querySelector('.star-text').textContent = "3 star: Average";
    } else if (onStar == 4) {
        stars[0].setAttribute('data-name', 'great');
        stars[3].classList.add('star-great');
        stars[2].classList.add('star-great');
        stars[1].classList.add('star-great');
        stars[0].classList.add('star-great');
        document.querySelector('.star-text').textContent = "4 star: Great";
    } else if (onStar == 5) {
        stars[0].setAttribute('data-name', 'excellent');
        stars[4].classList.add('star-excellent');
        stars[3].classList.add('star-excellent');
        stars[2].classList.add('star-excellent');
        stars[1].classList.add('star-excellent');
        stars[0].classList.add('star-excellent');
        document.querySelector('.star-text').textContent = "5 star: Excellent";
    }
}

function pass() {
    var title = document.getElementById("title").value;
    var body = document.getElementById("body").value;
    if (title == '' && body == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-title").innerHTML = 'Please enter your title';
        document.querySelector(".error-body").innerHTML = 'Please enter your review';
    } else if (title == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-title").innerHTML = 'Please enter your title';
    } else if (body == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-body").innerHTML = 'Please enter your review';
    } else {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".SignUp").style.display = 'block';
        document.querySelector(".EmailSignUp").style.display = 'block';
        document.querySelector(".continue").style.display = 'none';
    }

}

var firebaseConfig = {
    apiKey: "AIzaSyC3fOGWSafYmB1CKM8rDh_kVDHA08h6dRw",
    authDomain: "vereview.firebaseapp.com",
    databaseURL: "https://vereview.firebaseio.com",
    projectId: "vereview",
    storageBucket: "vereview.appspot.com",
    messagingSenderId: "278465510459",
    appId: "1:278465510459:web:cdda6a9ab3560f7700f01e",
    measurementId: "G-VCJ7449BLG"
};

function GoogleSignUp() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    const auth = firebase.auth();
    const db = firebase.firestore();
    var star_content = document.querySelector('.star-text').textContent;
    var star = "";
    if (star_content == "1 star: Bad") {
        star = "1";
    } else if (star_content == "2 star: Poor") {
        star = "2";
    } else if (star_content == "3 star: Average") {
        star = "3";
    } else if (star_content == "4 star: Great") {
        star = "4";
    } else if (star_content == "5 star: Excellent") {
        star = "5";
    }
    var title = document.getElementById("title").value;
    var body = document.getElementById("body").value;
    if (title == '' && body == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-title").innerHTML = 'Please enter your title';
        document.querySelector(".error-body").innerHTML = 'Please enter your review';
    } else if (title == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-title").innerHTML = 'Please enter your title';
    } else if (body == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-body").innerHTML = 'Please enter your review';
    } else {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        var user = "";
        var uid = "";
        firebase.auth().signInWithPopup(provider).then(async function(result) {
            var token = result.credential.accessToken;
            user = result.user;
            uid = user.uid;
            const userExists = await db.collection('USERS').doc(result.user.uid).get();
            if (userExists.data() == undefined) {
                return db.collection('USERS').doc(user.uid).set({
                    email: user.email,
                    lastName: result.additionalUserInfo.profile.family_name,
                    firstName: result.additionalUserInfo.profile.given_name,
                    birthday: null,
                    dateCreation: output,
                    disableAccount: false,
                    phoneNumber: '',
                    profilePicture: result.additionalUserInfo.profile.picture
                }).then(() => {
                    var myVar = JSON.stringify({ company: companyName, star: star, title: title, body: body, user: user.email, uid: uid });
                    chekReview(user.uid, myVar);
                });
            } else if (userExists.data() != undefined) {
                var myVar = JSON.stringify({ company: companyName, star: star, title: title, body: body, user: user.email, uid: uid });
                chekReview(user.uid, myVar);
            }
        }).catch(function(error) {
            alert(error.message);
        });
    }
}

function FbSignUp() {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    const auth = firebase.auth();
    const db = firebase.firestore();
    var star_content = document.querySelector('.star-text').textContent;
    var star = "";
    if (star_content == "1 star: Bad") {
        star = "1";
    } else if (star_content == "2 star: Poor") {
        star = "2";
    } else if (star_content == "3 star: Average") {
        star = "3";
    } else if (star_content == "4 star: Great") {
        star = "4";
    } else if (star_content == "5 star: Excellent") {
        star = "5";
    }
    var title = $("#title").val();
    var body = $("#body").val();
    if (title == '' && body == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-title").innerHTML = 'Please enter your title';
        document.querySelector(".error-body").innerHTML = 'Please enter your review';
    } else if (title == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-title").innerHTML = 'Please enter your title';
    } else if (body == '') {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        document.querySelector(".error-body").innerHTML = 'Please enter your review';
    } else {
        document.querySelector(".error-title").innerHTML = '';
        document.querySelector(".error-body").innerHTML = '';
        $('.error-body').empty();
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        firebase.auth().useDeviceLanguage();
        userResult = "";
        firebase.auth().signInWithPopup(provider).then(async function(result) {
            const userExists = await db.collection('USERS').doc(result.user.uid).get();
            userResult = result;
            if (userExists.data() == undefined) {
                db.collection('USERS').doc(userResult.user.uid).set({
                    email: userResult.user.email,
                    lastName: userResult.additionalUserInfo.profile.last_name,
                    firstName: userResult.additionalUserInfo.profile.first_name,
                    birthday: userResult.additionalUserInfo.profile.birthday,
                    dateCreation: output,
                    disableAccount: false,
                    phoneNumber: '',
                    profilePicture: userResult.additionalUserInfo.profile.picture.data.url
                }).then(() => {
                    var myVar = JSON.stringify({ company: companyName, star: star, title: title, body: body, user: userResult.user.email, uid: userResult.user.uid });
                    chekReview(userResult.user.uid, myVar);
                });
            } else if (userExists.data() != undefined) {
                var myVar = JSON.stringify({ company: companyName, star: star, title: title, body: body, user: userResult.user.email, uid: userResult.user.uid });
                chekReview(userResult.user.uid, myVar);
            }
        }).catch(function(error) {
            alert(error.message);
        });
    }
}

function userNotExist() {
    var userNotExist = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
    </head>
    <style type="text/css">
        #nw-container-widget-vereview input,
        #nw-container-widget-vereview textarea {
            box-sizing: border-box;
        }
        
        #nw-container-widget-vereview input::placeholder,
        #nw-container-widget-vereview textarea::placeholder,
        #nw-container-widget-vereview input,
        #nw-container-widget-vereview textarea {
            font-family: Roboto, sans-serif;
            font-size: 1rem;
            font-weight: 500;
            color: #495057;
        }
        
        @media only screen and (max-width: 990px) {
            #nw-container-widget-vereview {
                max-width: 100%;
            }
        }
        #nw-container-widget-vereview .star {
            height: 50px;
            width: 50px;
        }
        #nw-container-widget-vereview .star-content {
            font-size: 35px;
        }

        #nw-container-widget-vereview .elementStars {
            height: 30px;
            width: 30px;
        }
        
        #nw-container-widget-vereview .elementStarContent {
            font-size: 20px;
        }
        
        #nw-container-widget-vereview .elementNwTitleGbl {
            font-size: 18px !important;
        }
        
        #nw-container-widget-vereview .elementContentStars {
            display: block !important;
        }

        #nw-container-widget-vereview .pd-r0 {
            padding-right: 5px;
        }
        
        #nw-container-widget-vereview .pd-t0 {
            padding-top: 5px;
        }
        
        #nw-container-widget-vereview .pd-l0 {
            padding-left: 5px;
        }
        
        #nw-container-widget-vereview .pd-b0 {
            padding-bottom: 5px;
        }

        #nw-container-widget-vereview .pd-r1 {
            padding-right: 10px;
        }
        
        #nw-container-widget-vereview .pd-t1 {
            padding-top: 10px;
        }
        
        #nw-container-widget-vereview .pd-l1 {
            padding-left: 10px;
        }
        
        #nw-container-widget-vereview .pd-b1 {
            padding-bottom: 10px;
        }

        #nw-container-widget-vereview .pd-r2 {
            padding-right: 18px;
        }
        
        #nw-container-widget-vereview .pd-t2 {
            padding-top: 18px;
        }
        
        #nw-container-widget-vereview .pd-l2 {
            padding-left: 18px;
        }
        
        #nw-container-widget-vereview .pd-b2 {
            padding-bottom: 18px;
        }

        #nw-container-widget-vereview .pd-r3 {
            padding-right: 25px;
        }
        
        #nw-container-widget-vereview .pd-t3 {
            padding-top: 25px;
        }
        
        #nw-container-widget-vereview .pd-l3 {
            padding-left: 25px;
        }
        
        #nw-container-widget-vereview .pd-b3 {
            padding-bottom: 25px;
        }

        #nw-container-widget-vereview .pd-r4 {
            padding-right: 35px;
        }
        
        #nw-container-widget-vereview .pd-t4 {
            padding-top: 35px;
        }
        
        #nw-container-widget-vereview .pd-l4 {
            padding-left: 35px;
        }
        
        #nw-container-widget-vereview .pd-b4 {
            padding-bottom: 35px;
        }

        #nw-container-widget-vereview .pd-r5 {
            padding-right: 100px;
        }
        
        #nw-container-widget-vereview .pd-t5 {
            padding-top: 100px;
        }
        
        #nw-container-widget-vereview .pd-l5 {
            padding-left: 100px;
        }
        
        #nw-container-widget-vereview .pd-b5 {
            padding-bottom: 100px;
        }

        #nw-container-widget-vereview .mrg-r0 {
            margin-right: 5px;
        }
        
        #nw-container-widget-vereview .mrg-t0 {
            margin-top: 5px;
        }
        
        #nw-container-widget-vereview .mrg-l0 {
            margin-left: 5px;
        }
        
        #nw-container-widget-vereview .mrg-b0 {
            margin-bottom: 5px;
        }
  
        #nw-container-widget-vereview .mrg-r1 {
            margin-right: 10px;
        }
        
        #nw-container-widget-vereview .mrg-t1 {
            margin-top: 10px;
        }
        
        #nw-container-widget-vereview .mrg-l1 {
            margin-left: 10px;
        }
        
        #nw-container-widget-vereview .mrg-b1 {
            margin-bottom: 10px;
        }
 
        #nw-container-widget-vereview .mrg-r2 {
            margin-right: 18px;
        }
        
        #nw-container-widget-vereview .mrg-t2 {
            margin-top: 18px;
        }
        
        #nw-container-widget-vereview .mrg-l2 {
            margin-left: 18px;
        }
        
        #nw-container-widget-vereview .mrg-b2 {
            margin-bottom: 18px;
        }

        #nw-container-widget-vereview .mrg-r3 {
            margin-right: 25px;
        }
        
        #nw-container-widget-vereview .mrg-t3 {
            margin-top: 25px;
        }
        
        #nw-container-widget-vereview .mrg-l3 {
            margin-left: 25px;
        }
        
        #nw-container-widget-vereview .mrg-b3 {
            margin-bottom: 25px;
        }

        #nw-container-widget-vereview .mrg-r4 {
            margin-right: 35px;
        }
        
        #nw-container-widget-vereview .mrg-t4 {
            margin-top: 35px;
        }
        
        #nw-container-widget-vereview .mrg-l4 {
            margin-left: 35px;
        }
        
        #nw-container-widget-vereview .mrg-b4 {
            margin-bottom: 35px;
        }
    
        #nw-container-widget-vereview .mrg-r5 {
            margin-right: 100px;
        }
        
        #nw-container-widget-vereview .mrg-t5 {
            margin-top: 100px;
        }
        
        #nw-container-widget-vereview .mrg-l5 {
            margin-left: 100px;
        }
        
        #nw-container-widget-vereview .mrg-b5 {
            margin-bottom: 100px;
        }

        #nw-container-widget-vereview .mrg-md-t7 {
            margin-top: 13rem !important;
        }

        #nw-container-widget-vereview .mrg-lg-t8 {
            margin-top: 19rem !important;
        }

        #nw-container-widget-vereview .pd0 {
            padding: 5px;
        }

        #nw-container-widget-vereview .pd1 {
            padding: 10px;
        }

        #nw-container-widget-vereview .pd2 {
            padding: 18px;
        }

        #nw-container-widget-vereview .pd3 {
            padding: 25px;
        }

        #nw-container-widget-vereview .pd4 {
            padding: 35px;
        }

        #nw-container-widget-vereview .mrg0 {
            margin: 5px;
        }
        
        #nw-container-widget-vereview .mrg1 {
            margin: 10px;
        }
        
        #nw-container-widget-vereview .mrg2 {
            margin: 18px;
        }
        
        #nw-container-widget-vereview .mrg3 {
            margin: 25px;
        }
        
        #nw-container-widget-vereview .bg-shadow-border {
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
        }

        #nw-container-widget-vereview .nw-bg-grey-9 {
            background: rgba(238, 238, 238, 0.9);
        }

        #nw-container-widget-vereview .box-border {
            transition: .3s linear;
        }
        
        #nw-container-widget-vereview .stars-global {
            display: block;
            text-align: left;
        }
        
        #nw-container-widget-vereview .star {
            margin: 1px;
            background: #A0A0A0;
            border-radius: 50%;
            position: relative;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        #nw-container-widget-vereview .star-content {
            color: #fff;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            cursor: pointer;
        }
        
        #nw-container-widget-vereview .star-none {
            background-color: #A0A0A0;
        }
        
        #nw-container-widget-vereview .star-bad {
            background-color: #ff0000;
        }
        
        #nw-container-widget-vereview .star-poor {
            background-color: #ff8000;
        }
        
        #nw-container-widget-vereview .star-average {
            background-color: #FFCC36;
        }
        
        #nw-container-widget-vereview .star-great {
            background-color: #00ff40;
        }
        
        #nw-container-widget-vereview .star-excellent {
            background-color: #007d00;
        }
        
        #nw-container-widget-vereview .stars-global>span.star.hover1 {
            background-color: #ff0000;
        }
        
        #nw-container-widget-vereview .stars-global>span.star.hover2 {
            background-color: #ff8000;
        }
        
        #nw-container-widget-vereview .stars-global>span.star.hover3 {
            background-color: #FFCC36;
        }
        
        #nw-container-widget-vereview .stars-global>span.star.hover4 {
            background-color: #00ff40;
        }
        
        #nw-container-widget-vereview .stars-global>span.star.hover5 {
            background-color: #007d00;
        }
        
        #nw-container-widget-vereview .star-text {
            font-size: 17px;
            color: #A0A0A0;
            display: block;
            text-align: left;
        }

        #nw-container-widget-vereview .nw-btn-info {
            color: #fff !important;
            background-color: #007bff !important;
        }
        
        #nw-container-widget-vereview .nw-text-danger {
            color: #d32f2f !important;
        }

        #nw-container-widget-vereview .nw-btn {
            margin: .1rem;
            color: inherit;
            text-transform: uppercase;
            word-wrap: break-word;
            white-space: normal;
            cursor: pointer;
            border: 0;
            border-radius: .125rem;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12);
            -webkit-transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        }

        #nw-container-widget-vereview .body-review{
            display: none;
        }

        #nw-container-widget-vereview #nw-container-widget-vereview .form-review {
            margin: 0px 0px 0px 30px;
        }
        
        #nw-container-widget-vereview .SignUp {
            display: none;
        }
        
        #nw-container-widget-vereview .EmailSignUp {
            display: none;
        }

        #nw-container-widget-vereview .formSignup {
            display: none;
        }
        
        #nw-container-widget-vereview .primary {
            display: block;
        }
        
        #nw-container-widget-vereview .secondry {
            display: none;
        }

        #nw-container-widget-vereview .all-nw-stars {
            display: flex;
            margin-right: 30px;
        }
        
        #nw-container-widget-vereview .content-stars {
            display: flex;
            align-items: center;
        }
        
        #nw-container-widget-vereview .nw-form-write {
            padding: .375rem .375rem;
            font-size: 1rem;
            font-weight: 400;
            color: #495057;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: .25rem;
            width: 100%;
        }
        
        #nw-container-widget-vereview .nw-title-gbl {
            color: #757575 !important;
            font-family: Roboto, sans-serif;
            font-weight: 500;
            font-size: 29px;
        }
        
        #nw-container-widget-vereview .centering-elmt {
            text-align: center;
        }
        
        #nw-container-widget-vereview .block-btn-continue .continue,
        #nw-container-widget-vereview .block-btn-continue .primary,
        #nw-container-widget-vereview .block-btn-continue .secondry {
            padding: .84rem 2.14rem;
            font-size: .81rem;
        }
        
        #nw-container-widget-vereview .block-btn-continue {
            width: 100%;
            text-align: center;
        }
        
        #nw-container-widget-vereview .block-btn {
            display: flex;
            justify-content: center;
        }
        
        #nw-container-widget-vereview .nw-btn-social-media {
            margin: .375rem;
            margin-bottom: 0.375rem;
            color: inherit;
            text-transform: uppercase;
            word-wrap: break-word;
            white-space: normal;
            cursor: pointer;
            border: 0;
            border-radius: .125rem;
            -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
            padding: .84rem 2.14rem;
            font-size: .81rem;
        }
        
        #nw-container-widget-vereview .error {
            text-align: center;
        }
        
        #nw-container-widget-vereview .nw-row {
            display: flex;
            justify-content: space-between;
        }
        
        #nw-container-widget-vereview .nw-row .nw-col-6 {
            width: 49%;
        }
    </style>

    <body>
        <div class="bg-shadow-border nw-bg-grey-9 pd2">
            <div class="pd-t1 pd-b4 nw-title-gbl">Rating</div>
            <div class="">
                <div class="content-stars pd-b1">
                    <div class="stars-global white-space-nowrap all-nw-stars">
                        <span class="star" data-value='1' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                <svg class="bi bi-star-fill star-content" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </span>
                        <span class="star" data-value='2' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                <svg class="bi bi-star-fill star-content" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </span>
                        <span class="star" data-value='3' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                <svg class="bi bi-star-fill star-content" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </span>
                        <span class="star" data-value='4' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                <svg class="bi bi-star-fill star-content" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </span>
                        <span class="star" data-value='5' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                <svg class="bi bi-star-fill star-content" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                            </span>
                    </div>
                    <div class="white-space-nowrap">
                        <div class="">
                            <span class="star-text">Roll over stars, then click to rate</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body-review">
                <form id="continue">
                    <div class="">
                        <p class="nw-title-gbl">Title of your review</p>
                        <input class="nw-form-write" type="text" id="title" name="title" placeholder="Title">
                        <div class="error-title nw-text-danger size15 text-right"></div>
                        <p class="nw-title-gbl pd-t1">Your review</p>
                        <textarea class="nw-form-write" id="body" name="body" rows="7" placeholder="Share your honest experience, and help others make better choices."></textarea>
                        <div class="error-body nw-text-danger size15 text-right"></div>
                    </div>
                    <div class="block-btn-continue mrg-t1"><button type="button" class="nw-btn nw-btn-info continue" onclick="pass()">Continue</button></div>
                </form>
            </div>
            <div class="SignUp centering-elmt">
                <p class="nw-title-gbl pd-t1">Post and verify yourself with </p>
                <button type="button" id="SignUpFacebook" onclick="FbSignUp()" class="mrg-b3 nw-btn-social-media"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> Facebook</button>
                <button type="button" id="SignUpGoogle" onclick="GoogleSignUp()" class="mrg-b3 nw-btn-social-media"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 24"><path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"/></svg> Google</button><br>
            </div>
            <div class="EmailSignUp" id="EmailSignUp">
                <div class="error nw-text-danger size15"></div>
                <form class="mrg-t2" id="LoginSignUp-form">
                    <div class=""><input type="email" id="email" class="nw-form-write mrg-b2" placeholder="E-mail"></div>
                    <div class=""><input type="password" id="password" class="nw-form-write mrg-b2" placeholder="Password"></div>
                    <div class="formSignup">
                        <div class="nw-row">
                            <div class="nw-col-6">
                                <input type="text" id="firstName" class="nw-form-write" placeholder="First Name">
                                <div class="error-lName text-right nw-text-danger size15"></div>
                            </div>
                            <div class="nw-col-6">
                                <input type="text" id="lastName" class="nw-form-write" placeholder="Last Name">
                                <div class="error-fName text-right nw-text-danger size15"></div>
                            </div>
                        </div>
                    </div>
                    <div class="block-btn block-btn-continue mrg-t2"><button class="nw-btn nw-btn-info primary" type="button" id="addF">Continue</button></div>
                    <div class="block-btn block-btn-continue mrg-t2"><button class="nw-btn nw-btn-info secondry" type="button" id="addS">Continue</button></div>
                </form>
            </div>
        </div>
    </body>
    </html>`;
    return userNotExist;
}

function goProfile() {
    var goProfile = `<div class="mrg-t5">You have already added a review to this company. <a href='https://vereview.web.app/'>Go to our website</a></div>`;
    return goProfile;
}

function goHome() {
    var goHome = `<div class="mrg-t5">The page you're looking for could not be found. <a href='https://vereview.web.app/'>Go to our website</a></div>`;
    return goHome;
}

document.getElementById("nw-container-widget-vereview").addEventListener("load", function() {
    adaptElementOnResizeWidget();
});

window.onresize = function(event) {
    adaptElementOnResizeWidget();
};

function adaptElementOnResizeWidget() {
    var sizeContainerWidget = document.getElementById('nw-container-widget-vereview').getBoundingClientRect().width;
    var stars = document.getElementsByClassName("star");
    var starContent = document.getElementsByClassName("star-content");
    var nwTitleGbl = document.getElementsByClassName("nw-title-gbl");
    var contentStars = document.getElementsByClassName("content-stars");
    if (sizeContainerWidget <= 440) {
        for (var i = 0; i < stars.length; i++) {
            stars[i].classList.add('elementStars');
        }
        for (var i = 0; i < starContent.length; i++) {
            starContent[i].classList.add('elementStarContent');
        }
        for (var i = 0; i < nwTitleGbl.length; i++) {
            nwTitleGbl[i].classList.add('elementNwTitleGbl');
        }
    }
    if (sizeContainerWidget <= 600) {
        for (var i = 0; i < contentStars.length; i++) {
            contentStars[i].classList.add('elementContentStars');
        }
    }
    if (sizeContainerWidget > 440) {
        for (var i = 0; i < stars.length; i++) {
            stars[i].classList.remove('elementStars');
        }
        for (var i = 0; i < starContent.length; i++) {
            starContent[i].classList.remove('elementStarContent');
        }
        for (var i = 0; i < nwTitleGbl.length; i++) {
            nwTitleGbl[i].classList.remove('elementNwTitleGbl');
        }
    }
    if (sizeContainerWidget > 600) {
        for (var i = 0; i < contentStars.length; i++) {
            contentStars[i].classList.remove('elementContentStars');
        }
    }
}
