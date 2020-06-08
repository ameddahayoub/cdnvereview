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
var companyName = $('.box-rate').attr('id');
var apiUrl = "https://vereview.appspot.com";
$(document).ready(function() {
    console.log(companyName);
    if (!isCompanyExist(companyName)) {
        $('.box-rate').html(goHome);
    } else {
        $('.box-rate').html(userNotExist());
    }
    $(document).on('click', '#addF', async function(e) {
        e.preventDefault();
        var star = $(".star-text").text();
        var title = $("#title").val();
        var body = $("#body").val();
        if (title == '' && body == '') {
            $('.error-title').empty();
            $('.error-body').empty();
            $('.error-title').html('Please enter your title');
            $('.error-body').html('Please enter your review');
        } else if (title == '') {
            $('.error-title').empty();
            $('.error-body').empty();
            $('.error-title').html('Please enter your title');
        } else if (body == '') {
            $('.error-title').empty();
            $('.error-body').empty();
            $('.error-body').html('Please enter your review');
        } else if (title != '' && body != '') {
            $('.error-title').empty();
            $('.error-body').empty();
            var usercheck = await db.collection('USERS').where('email', '==', $('#email').val()).get();
            if (usercheck.docs.length == 0) {
                var email = $('#email').val();
                var password = $('#password').val();
                var user = "";
                var uid = "";
                if (email == '' || password == '') {
                    $('.error').empty();
                    $('.error').html('Please fill the form bellow');
                } else if (email != '' && password != '') {
                    $('.error').empty();
                    $('.formSignup').css('display', 'block');
                    $('.primary').css('display', 'none');
                    $('.secondry').css('display', 'block');
                    $(document).on('click', '#addS', async function(e) {
                        var firstName = $('#firstName').val();
                        var lastName = $('#lastName').val();
                        if (firstName == '' && lastName == '') {
                            $('.error-fName').empty();
                            $('.error-lName').empty();
                            $('.error-fName').html('Please enter you first Name');
                            $('.error-lName').html('Please enter you last Name');
                        } else if (firstName == '') {
                            $('.error-fName').empty();
                            $('.error-lName').empty();
                            $('.error-fName').html('Please enter you first Name');
                        } else if (lastName == '') {
                            $('.error-fName').empty();
                            $('.error-lName').empty();
                            $('.error-lName').html('Please enter you last Name');
                        } else if (firstName != '' && lastName != '') {
                            $('.error').empty();
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
                                $('.error').html(error.message);
                            });
                        }
                    });
                }
            } else {
                var email = $('#email').val();
                var password = $('#password').val();
                auth.signInWithEmailAndPassword(email, password).then(cred => {
                    var myVar = JSON.stringify({ company: companyName, star: star, title: title, body: body, user: cred.user.email, uid: cred.user.uid });
                    chekReview(cred.user.uid, myVar);
                    signupForm.querySelector('.error').innerHTML = "";
                }).catch(function(error) {
                    $('.error').empty();
                    $('.error').html(error.message);
                });
            }
        }
    });
});

function isCompanyExist(companyName) {
    var exist;
    $.ajax({
        async: false,
        url: apiUrl + "/isCompanyExist",
        type: "GET",
        dataType: "json",
        data: { company: companyName },
        success: function(isExist) {
            exist = isExist;
        }
    });
    return exist;
}

function isReviewExist(uid, companyName) {
    var exist;
    $.ajax({
        async: false,
        url: apiUrl + "/isReviewExist",
        type: "GET",
        dataType: "json",
        data: { uid: uid, company: companyName },
        success: function(isExist) {
            exist = isExist;
        }
    });
    return exist;
}

function addReview(myVar) {
    $.ajax({
        async: false,
        url: apiUrl + '/evaluate',
        type: 'POST',
        data: 'jsonData=' + myVar,
        dataType: 'json',
        success: function() {

        }
    });
}

function chekReview(uid, myVar) {
    $.ajax({
        url: apiUrl + "/isReviewExist",
        type: "GET",
        dataType: "json",
        data: { uid: uid, company: companyName },
        success: function(isExist) {
            if (!isExist) {
                addReview(myVar);
                // window.location.replace("profile.html");
            } else {
                $('.box-rate').empty();
                $('.box-rate').html(goProfile());
            }
        }
    });
}

function getCompany() {
    var company2;
    $.ajax({
        async: false,
        url: apiUrl + "/company",
        type: "GET",
        dataType: "json",
        data: { company: companyName },
        success: function(companyInfo) {
            company2 = companyInfo.company;
        }
    });
    return company2;
}

function getUserInfo(userEmail) {
    var user2;
    $.ajax({
        async: false,
        url: apiUrl + "/user",
        type: "GET",
        dataType: "json",
        data: { email: userEmail },
        success: function(user) {
            user2 = user;
        }
    });
    return user2;
}

function starmarkIN(item) {
    var onStar = parseInt($(item).data('value'), 10);
    var stars = $(item).parent().children('span.star');
    if (stars.data('name') == 'bad') {
        $(stars[0]).removeClass('star-bad');
    } else if (stars.data('name') == 'poor') {
        $(stars[0]).removeClass('star-poor');
        $(stars[1]).removeClass('star-poor');
    } else if (stars.data('name') == 'average') {
        $(stars[0]).removeClass('star-average');
        $(stars[1]).removeClass('star-average');
        $(stars[2]).removeClass('star-average');
    } else if (stars.data('name') == 'great') {
        $(stars[0]).removeClass('star-great');
        $(stars[1]).removeClass('star-great');
        $(stars[2]).removeClass('star-great');
        $(stars[3]).removeClass('star-great');
    } else if (stars.data('name') == 'excellent') {
        $(stars[0]).removeClass('star-excellent');
        $(stars[1]).removeClass('star-excellent');
        $(stars[2]).removeClass('star-excellent');
        $(stars[3]).removeClass('star-excellent');
        $(stars[4]).removeClass('star-excellent');

    }
    for (i = 0; i < onStar; i++) {
        if (i == 0) {
            $(".star-text").text("1 star: Bad");
            $(stars[i]).addClass('hover1');
        } else if (i == 1) {
            $(".star-text").text("2 star: Poor");
            $(stars[i - 1]).addClass('hover2');
            $(stars[i]).addClass('hover2');
        } else if (i == 2) {
            $(".star-text").text("3 star: Average");
            $(stars[i - 2]).addClass('hover3');
            $(stars[i - 1]).addClass('hover3');
            $(stars[i]).addClass('hover3');
        } else if (i == 3) {
            $(".star-text").text("4 star: Great");
            $(stars[i]).removeClass('star-great');
            $(stars[i - 3]).addClass('hover4');
            $(stars[i - 2]).addClass('hover4');
            $(stars[i - 1]).addClass('hover4');
            $(stars[i]).addClass('hover4');
        } else if (i == 4) {
            $(".star-text").text("5 star: Excellent");
            $(stars[i - 4]).addClass('hover5');
            $(stars[i - 3]).addClass('hover5');
            $(stars[i - 2]).addClass('hover5');
            $(stars[i - 1]).addClass('hover5');
            $(stars[i]).addClass('hover5');
        }
    }
}

function starmarkOUT(item) {
    var x = $(item).parent().children('span.star');
    x.removeClass('hover1');
    x.removeClass('hover2');
    x.removeClass('hover3');
    x.removeClass('hover4');
    x.removeClass('hover5');
    x.removeClass('star-bad');
    x.removeClass('star-poor');
    x.removeClass('star-average');
    x.removeClass('star-great');
    x.removeClass('star-excellent');
    if (x.data('name') == 'bad') {
        $(x[0]).addClass('star-bad');
        $(".star-text").text("1 star: Bad");
    } else if (x.data('name') == 'poor') {
        $(x[0]).addClass('star-poor');
        $(x[1]).addClass('star-poor');
        $(".star-text").text("2 star: Poor");
    } else if (x.data('name') == 'average') {
        $(x[0]).addClass('star-average');
        $(x[1]).addClass('star-average');
        $(x[2]).addClass('star-average');
        $(".star-text").text("3 star: Average");
    } else if (x.data('name') == 'great') {
        $(x[0]).addClass('star-great');
        $(x[1]).addClass('star-great');
        $(x[2]).addClass('star-great');
        $(x[3]).addClass('star-great');
        $(".star-text").text("4 star: Great");
    } else if (x.data('name') == 'excellent') {
        $(x[0]).addClass('star-excellent');
        $(x[1]).addClass('star-excellent');
        $(x[2]).addClass('star-excellent');
        $(x[3]).addClass('star-excellent');
        $(x[4]).addClass('star-excellent');
        $(".star-text").text("5 star: Excellent");
    }
    if (x.data('bool') == false) {
        $(".star-text").text("Roll over stars, then click to rate");
    }
}

function starmark(item) {
    $(".body-review").css("display", "block");
    var onStar = parseInt($(item).data('value'), 10);
    var stars = $(item).parent().children('span.star');
    stars.data('bool', 'true');
    for (i = 0; i < stars.length; i++) {
        $(stars[i]).addClass('star-none');
    }
    for (i = 0; i < onStar; i++) {
        if (i == 0) {
            $(stars).data('name', 'bad');
            $(stars[i]).addClass('star-bad');
            $(".star-text").text("1 star: Bad");
        } else if (i == 1) {
            $(stars).data('name', 'poor');
            $(stars[i - 1]).addClass('star-poor');
            $(stars[i]).addClass('star-poor');
            $(".star-text").text("2 star: Poor");
        } else if (i == 2) {
            $(stars).data('name', 'average');
            $(stars[i - 2]).addClass('star-average');
            $(stars[i - 1]).addClass('star-average');
            $(stars[i]).addClass('star-average');
            $(".star-text").text("3 star: Average");
        } else if (i == 3) {
            $(stars).data('name', 'great');
            $(stars[i - 3]).addClass('star-great');
            $(stars[i - 2]).addClass('star-great');
            $(stars[i - 1]).addClass('star-great');
            $(stars[i]).addClass('great');
            $(".star-text").text("4 star: Great");
        } else if (i == 4) {
            $(stars).data('name', 'excellent');
            $(stars[i - 4]).addClass('star-excellent');
            $(stars[i - 3]).addClass('star-excellent');
            $(stars[i - 2]).addClass('star-excellent');
            $(stars[i - 1]).addClass('star-excellent');
            $(stars[i]).addClass('star-excellent');
            $(".star-text").text("5 star: Excellent");
        }
    }
}

function pass() {
    var title = $('#title').val();
    var body = $('#body').val();
    if (title == '' && body == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-title').html('Please enter your title');
        $('.error-body').html('Please enter your review');
    } else if (title == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-title').html('Please enter your title');
    } else if (body == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-body').html('Please enter your review');
    } else {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.post').css("display", "none");
        $('.SignUp').css("display", "block");
        $('.continue').css("display", "none");
    }
}

function showEmail() {
    $('#EmailSignUp').css("display", "block");
    $('.continue-with-email').css("display", "none");
}

function GoogleSignUp() {
    $('#EmailSignUp').css("display", "none");
    $('.continue-with-email').css("display", "block");
    var star = $(".star-text").text();
    var title = $("#title").val();
    var body = $("#body").val();
    if (title == '' && body == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-title').html('Please enter your title');
        $('.error-body').html('Please enter your review');
    } else if (title == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-title').html('Please enter your title');
    } else if (body == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-body').html('Please enter your review');
    } else {
        $('.error-title').empty();
        $('.error-body').empty();
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
    $('#EmailSignUp').css("display", "none");
    $('.continue-with-email').css("display", "block");
    var star = $(".star-text").text();
    var title = $("#title").val();
    var body = $("#body").val();
    if (title == '' && body == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-title').html('Please enter your title');
        $('.error-body').html('Please enter your review');
    } else if (title == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-title').html('Please enter your title');
    } else if (body == '') {
        $('.error-title').empty();
        $('.error-body').empty();
        $('.error-body').html('Please enter your review');
    } else {
        $('.error-title').empty();
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
    var userNotExist = `<span class="Roboto-bold">Voice your opinion! Review</span>
    <span class="Roboto-bold nw-text-info">${getCompany()}</span>
    <span class="Roboto-bold">now.</span>
    <div class="col-lg-12 pd-t4">
        <div class="row mrg-b3 d-flex justify-content-center">
            <div class="bg-shadow-border nw-bg-grey-9 pd2 box-border">
                <div class="d-flex align-items-center pd-t1 pd-b1">
                    <p class="Roboto-medium pd-l2 nw-text-grey">Rating</p>
                </div>
                <div class="col-lg-12">
                    <div class="row d-flex align-items-center pd-b1">
                        <div class="col-lg-6 col-md-6 col-12 stars-global white-space-nowrap">
                            <span class="star" data-value='1' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                    <span class="fa fa-star star-content"></span>
                            </span>
                            <span class="star" data-value='2' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                    <span class="fa fa-star star-content"></span>
                            </span>
                            <span class="star" data-value='3' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                    <span class="fa fa-star star-content"></span>
                            </span>
                            <span class="star" data-value='4' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                    <span class="fa fa-star star-content"></span>
                            </span>
                            <span class="star" data-value='5' data-bool='false' data-name='none' onclick="starmark(this)" onmouseover="starmarkIN(this)" onmouseout="starmarkOUT(this)">
                                    <span class="fa fa-star star-content"></span>
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
                    <button type="button" id="SignUpFacebook" onclick="FbSignUp()" class="btn btn-fb mrg-b3"><i class="fab fa-facebook-f pr-1"></i> Facebook</button>
                    <button type="button" id="SignUpGoogle" onclick="GoogleSignUp()" class="btn btn-gplus mrg-b3"><i class="fab fa-google-plus-g pr-1"></i> Google</button><br>
                    <p class="Roboto-regular nw-text-grey continue-with-email d-flex justify-content-center"><button class="nav-link btn-with-email text-center" onclick="showEmail()" type="submit">Continue with email</button></p>
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
                                    <input type="text" id="lastName" class="form-control" placeholder="Last Name">
                                    <div class="error-lName text-right nw-text-danger size15"></div>
                                </div>
                                <div class="col-lg-6">
                                    <input type="text" id="firstName" class="form-control" placeholder="First Name">
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