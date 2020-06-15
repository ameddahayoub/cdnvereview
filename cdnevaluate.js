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
            var star = document.querySelector(".star-text").textContent;
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
                var usercheck = await db.collection('USERS').where('email', '==', $('#email').val()).get();
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
    }
    if (x[0].getAttribute("data-bool") == false) {
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
    var star = document.querySelector('.star-text').textContent;
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
    var star = document.querySelector('.star-text').textContent;
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
    <div class="col-lg-12 pd-t4">
        <div class="row mrg-b3 d-flex justify-content-center">
            <div class="bg-shadow-border nw-bg-grey-9 pd2 box-border">
                <div class="d-flex align-items-center pd-t1 pd-b1">
                    <p class="Roboto-medium pd-l2 nw-text-grey">Rating</p>
                </div>
                <div class="col-lg-12">
                    <div class="row pd-b1">
                        <div class="col-lg-6 col-md-6 col-12 stars-global d-flex align-items-center white-space-nowrap ">
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
                        <div class="col-lg-6 col-md-6 white-space-nowrap">
                            <div class="">
                                <span class="star-text">Roll over stars, then click to rate</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 body-review">
                    <form id="continue">
                        <div class="form-group">
                            <p class="text-review pd-t1 nw-text-grey text-left">Title of your review</p>
                            <input class="form-control" type="text" id="title" name="title" placeholder="Title">
                            <div class="error-title nw-text-danger size15 text-right"></div>
                            <p class="text-review pd-t1 nw-text-grey text-left">Your review</p>
                            <textarea class="form-control" id="body" name="body" rows="7" placeholder="Share your honest experience, and help others make better choices."></textarea>
                            <div class="error-body nw-text-danger size15 text-right"></div>
                        </div>
                        <div class="d-flex justify-content-center"><button type="button" class="btn btn-primary continue" onclick="pass()">Continue</button></div>
                    </form>
                </div>
                <div class="SignUp col-lg-12">
                    <p class="Roboto-regular pd-t1 nw-text-grey">Post and verify yourself with </p><br>
                    <button type="button" id="SignUpFacebook" onclick="FbSignUp()" class="btn btn-fb mrg-b3 border"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> Facebook</button>
                    <button type="button" id="SignUpGoogle" onclick="GoogleSignUp()" class="btn btn-gplus mrg-b3 border"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fill-rule="evenodd" clip-rule="evenodd"/></svg> Google</button><br>
                </div>
                <div class="col-lg-12 EmailSignUp" id="EmailSignUp">
                    <div class="error text-center nw-text-danger size15"></div>
                    <form class="form-group" id="LoginSignUp-form">
                        <div class="col-lg-12">
                            <input type="email" id="email" class="form-control mrg-b2" placeholder="E-mail">
                        </div>
                        <div class="col-lg-12">
                            <input type="password" id="password" class="form-control mrg-b2" placeholder="Password">
                        </div>
                        <div class="col-lg-12 formSignup">
                            <div class="row">
                                <div class="col-lg-6">
                                    <input type="text" id="firstName" class="form-control" placeholder="First Name">
                                    <div class="error-lName text-right nw-text-danger size15"></div>
                                </div>
                                <div class="col-lg-6">
                                    <input type="text" id="lastName" class="form-control" placeholder="Last Name">
                                    <div class="error-fName text-right nw-text-danger size15"></div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center"><button class="btn btn-primary primary" type="button" id="addF">Continue</button></div>
                        <div class="d-flex justify-content-center mrg-t2"><button class="btn btn-primary secondry" type="button" id="addS">Continue</button></div>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
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