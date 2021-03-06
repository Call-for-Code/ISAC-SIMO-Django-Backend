/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

// Custom Functions //

var _globalevent = null
var _popDirection = 'fadeInLeft'

function leftRightHandle(e){
    if (Swal.isVisible() && _globalevent) {
        switch (e.keyCode) {
            case 37:
                if(_globalevent.target.previousElementSibling){
                    _popDirection = 'fadeInRight';
                    _globalevent.target.previousElementSibling.click();
                }else{
                    $('.swal2-container.swal2-shown').css('background-color','rgba(0, 0, 0, 0.84)');
                }
                break;
            case 39:
                if(_globalevent.target.nextElementSibling){
                    _popDirection = 'fadeInLeft';
                    _globalevent.target.nextElementSibling.click();
                }else{
                    $('.swal2-container.swal2-shown').css('background-color','rgba(0, 0, 0, 0.84)');
                }
                break;
        }
    }
}

// IMAGE POP show
function showImagePop(event, img, alt, title, slide){
    event.preventDefault();
    Pace.restart();
    if(title){
        title = title.split("|").map(function(i){return i.trim().split(":").map(function(i){return i.trim()}).join(": ")}).join(" | ");
    }

    if(event.target.tagName.toLowerCase() == 'a' || slide){
        Swal.fire({
            imageUrl: img,
            imageAlt: alt?alt:'Image Failed to Load',
            title: title?title:'',
            confirmButtonText: '<i class="fa fa-times" aria-hidden="true"></i>',
            animation: false,
            customClass: "animated faster "+_popDirection,
            onOpen: function(toast){
                _globalevent = event
                toast.addEventListener('keydown', leftRightHandle);
            },
            onClose: function(toast){
                _globalevent = null
                toast.removeEventListener('keydown', leftRightHandle);
            }
        })
    }else{
        Swal.fire({
            imageUrl: img,
            imageAlt: alt?alt:'Image Failed to Load',
            title: title?title:'',
            confirmButtonText: '<i class="fa fa-times" aria-hidden="true"></i>',
            onClose: function(toast){
                _globalevent = null
                toast.removeEventListener('keydown', leftRightHandle);
            }
        })
    }
}

// Simple Delete Confirm Alert
function deleteData(event, element, name){
    event.preventDefault();
    var title = 'Delete This '+(name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g,' ')+'?')
    Swal.fire({
        title: title,
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#ad2424',
        reverseButtons: true,
        cancelButtonText: 'No, cancel!',
        }).then((result) => {
        if (result.value) {
          Pace.restart();
          $('#'+element).submit();
        }
    })
    $('.swal2-cancel').focus();
}

// TO DELETE WITH TYPING CONFIRM MESSAGE (NO DRAG/DROP/COPY/PASTE Allowed)
function deleteDataWriteConfirm(event, element, name){
    var toType = 'CONFIRM';
    event.preventDefault();
    var title = 'Delete This '+(name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g,' ')+'?')
    Swal.fire({
        title: title,
        html: "You won't be able to revert this!<br/>Type <b>'"+toType+"'</b> below to delete it.",
        type: 'warning',
        input: 'text',
        inputPlaceholder: '. . .',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#ad2424',
        reverseButtons: true,
        cancelButtonText: 'No, cancel!',
        inputValidator: (value) => {
          if (!value || value != toType) {
            return "Write '"+toType+"' in all caps."
          }
        },
    }).then((result) => {
        if (result.value) {
            if (result.value == toType) {
                Pace.restart();
                $('#'+element).attr('method','POST');
                $('#'+element).submit();
            }
        }
    })

    // On drag copy etc disable for CONFIRM text (toType var)
    // (if allowdrop is set - in debug do nothing)
    $('.swal2-input').css('text-align','center');
    if(typeof allowdrop === 'undefined' || allowdrop != true){
        $('.swal2-input').bind('copy paste drop', function (e) {
            e.preventDefault();
            $('.swal2-input').val('');
            Swal.showValidationMessage('Please Type (Copy/Paste/Drag no allowed)');
        });
    }else{
        $('.swal2-input').val(toType);
    }
}

// Simple Delete Confirm Alert
function confirmWithForm(event, element, title){
    event.preventDefault();
    var title = title;
    Swal.fire({
        title: title,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ad2424',
        reverseButtons: true,
        cancelButtonText: 'No, cancel!',
        }).then((result) => {
        if (result.value) {
          Pace.restart();
          $('#'+element).submit();
        }
    })
    $('.swal2-cancel').focus();
}

// Simple Ok confirm
function simpleConfirm(event, to, text, download){
    event.preventDefault();
    Swal.fire({
        title: "Please Confirm this Action ?",
        text: text?text:'Proceed to action',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ad2424',
        reverseButtons: true,
        cancelButtonText: 'No, cancel!',
        }).then((result) => {
        if (result.value) {
          Pace.restart();
          if(download){
            window.location.assign(to);
          }else{
            location.href = to;
          }
        }
    })
    $('.swal2-cancel').focus();
}

function atopost(event, to, csrf_token){
    event.preventDefault();
    Pace.restart();
    $.ajax({
        type: "POST",
        url: to,
        data: {'csrfmiddlewaretoken': csrf_token},
        dataType: "json",
        success: function(res) {
            Swal.fire({
                'title': res.message?res.message:'Success',
                'html': res.data
            })
        },
        error: function(err) {
            if(err.responseJSON){
                Swal.fire({
                    'title': err.responseJSON.message?err.responseJSON.message:'Failed',
                })
            }else{
                Swal.fire({
                    'title': 'Failed',
                })
            }
        },
    });
}

// TO TIGGER SWAL INPUT FOR go/nogo verify and type
function verifyImage(event, id, result, score, object_type, verified, url, retrained, pipeline_status, csrf){
    var html = '<form action="'+url+'" id="image_file_verify" method="POST">'+
                '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrf+'" />'+
                '<label class="swal2-label">Result:</label>'+
                '<input id="test-result" name="test-result" placeholder="No Result" class="swal2-input" style="margin: 0.5em auto;" value="'+result+'">' +
                '<label class="swal2-label">Score:</label>'+
                '<input id="test-score" name="test-score" placeholder="No Score" class="swal2-input" disabled style="background: #c7c7c7;margin: 0.5em auto;" value="'+score+'">'+
                '<label class="swal2-label">Object Type:</label>'+
                '<input id="test-object-type" name="test-object-type" placeholder="Object Not Detected" class="swal2-input" style="margin: 0.5em auto;" value="'+object_type+'">'+
                '<label class="swal2-label" style="display: inline-block;float: left;">Verified:'+
                '<input type="checkbox" id="test-verified" name="test-verified" class="swal2-checkbox" style="margin: 0.5em;transform: scale(1.4);display: inline;"'+ (verified?'checked':'') +'>'+
                '</label>'+
                '<label class="swal2-label" style="display: inline-block;float: right;margin: 0.5em;">Retrained: '+(retrained?'Yes':'No')+'</label>';

    html = html + '<label class="swal2-label" style="font-size: 1.1em;margin-top: 40px;">Pipeline Status:</label>';
    var pipeline_status_data = JSON.parse(pipeline_status)
    // console.log(pipeline_status_data)
    if(Object.keys(pipeline_status_data).length > 0){
        Object.keys(pipeline_status_data).forEach(function(key){
            if(pipeline_status_data[key]["result"]){
                var result = pipeline_status_data[key]["result"].split("|").map(function(i){return i.trim().split(":").map(function(i){return i.trim()}).join(": ")}).join(" | ");
                if(pipeline_status_data[key]["image"]) {
                    html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;"><b>Model:</b> '+key+', <b>Result:</b> '+result+', <b>Image: <a href="#!" onclick="Swal.fire({imageUrl:\''+ pipeline_status_data[key]["image"] +'\', title: \'Pre-Processed Image\'})">View</a></b>, <b>Score:</b> '+pipeline_status_data[key]["score"];
                } else {
                    html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;"><b>Model:</b> '+key+', <b>Result:</b> '+result+', <b>Score:</b> '+pipeline_status_data[key]["score"];
                }

                if(pipeline_status_data[key]["message"]){
                    let d = pipeline_status_data[key]["message"];
                    if(Array.isArray(pipeline_status_data[key]["message"]) || typeof pipeline_status_data[key]["message"] === "object"){
                        d = '<a href="#!" onclick="alert(JSON.stringify(JSON.parse(decodeURIComponent(\''+encodeURIComponent(JSON.stringify(d))+'\')),null,2))">View</a> | <a href="#!" onclick="prompt(\'Copy\',JSON.stringify(JSON.parse(decodeURIComponent(\''+encodeURIComponent(JSON.stringify(d))+'\')),null,2))">Copy</a>';
                    }
                    html = html + ', <b>Message:</b> '+d;
                }

                html = html + '</label>';
            }else{
                let d = pipeline_status_data[key];
                if(Array.isArray(pipeline_status_data[key]) || typeof pipeline_status_data[key] === "object"){
                    d = '<a href="#!" onclick="alert(JSON.stringify(JSON.parse(decodeURIComponent(\''+encodeURIComponent(JSON.stringify(d))+'\')),null,2))">View</a> | <a href="#!" onclick="prompt(\'Copy\',JSON.stringify(JSON.parse(decodeURIComponent(\''+encodeURIComponent(JSON.stringify(d))+'\')),null,2))">Copy</a>';
                }
                html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;"><b>Model:</b> '+key+', <b>Result:</b> '+d+'</label>';
            }
        })
    }else{
        html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;">No Status Data to Show</label>'
    }

    html = html + '</form>';

    Swal.fire({
        title: 'Verify Test Results - '+id,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Close',
        html: html,
        focusConfirm: false,
        width: '60vw',
        preConfirm: function(){
            Pace.restart();
            if(retrained && !document.getElementById('test-verified').checked){
                $('#swal2-validation-message').css({'float':'left','width':'100%'});
                Swal.showValidationMessage('Note: Image was already used to "Re-Train" <br/> & now is "Un-Verified"<br/>Click "Update" again to confirm.');
                retrained = false;
            }else{
                $('#image_file_verify').submit();
            }
        }
    })
    $('#test-result').blur()
}

// Tooltip resets (kinda needed) & register serviceworker
$(function () {
    $(".table-options a").tooltip({trigger: 'hover'});
    $("[data-toggle='tooltip']").tooltip({trigger: 'hover'});

    $('.main-container').one('mouseover', function(){
        if($('.main-container').css('opacity') == '0'){
            $('.main-container').css('transition','all 0.3s ease');
            $('.main-container').css('opacity','1');
        }
    });

    // REGISTER THE SERVICE WORKER //
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('/serviceworker.js')
        .then(val => {console.log('Service Worker Trying to Register')})
        .catch(e => {console.log('Service Worker Failed to Load Properly')})
    }else{
        console.log('Service Worker will not work.')
    }

    // GET Service worker registration instance from anywhere //
    if('serviceWorker' in navigator){
        navigator.serviceWorker.getRegistration()
            .then(r => {
                if(r && r.active && r.active.state == 'activated'){
                    r.update() // Force Update
                }
                
                r.addEventListener('updatefound', evt => { // If Force Update found some update
                    const swInstalling = r.installing;
                    swInstalling.addEventListener('statechange', evt => {
                        if(swInstalling.state == 'installed'){
                            console.log('new sw version found and installed')
                            if(localStorage.getItem('not-first-dashboard')){
                                if ( ((new Date() - new Date(localStorage.getItem('not-first-dashboard'))) / 1000 / 60 / 60) >= 24 ) {
                                    localStorage.setItem('not-first-dashboard', new Date().toLocaleString())
                                    $(document).Toasts('create', {
                                        title: 'New Version Available',
                                        autohide: true,
                                        class: 'bg-info',
                                        position: 'bottomRight',
                                        delay: 5000,
                                        body: '<button onclick="location.reload()" class="btn btn-sm btn-success">Reload Page Now</button>'
                                    })
                                }
                            }else{
                                localStorage.setItem('not-first-dashboard', new Date().toLocaleString())
                            }
                        }
                    })
                })
            })
            .catch(e => {console.log(e)})
    }
});

// SHOW Pipeline Status in Swal //
function showPipelineStatus(event, pipeline_status, latlng, decodeURI){
    event.preventDefault();
    html = '<label class="swal2-label" style="font-size: 1.1em;margin-top: 10px;">Pipeline Status:</label>';
    var pipeline_status_data = null
    if(decodeURI){
        pipeline_status_data = JSON.parse(decodeURIComponent(pipeline_status))
    }else{
        pipeline_status_data = JSON.parse(pipeline_status)
    }

    if(Object.keys(pipeline_status_data).length > 0){
        Object.keys(pipeline_status_data).forEach(function(key){
            if(pipeline_status_data[key]["result"]){
                var result = pipeline_status_data[key]["result"].split("|").map(function(i){return i.trim().split(":").map(function(i){return i.trim()}).join(": ")}).join(" | ");
                if(pipeline_status_data[key]["image"]) {
                    html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;"><b>Model:</b> '+key+', <b>Result:</b> '+result+', <b>Image: <a href="#!" onclick="Swal.fire({imageUrl:\''+ pipeline_status_data[key]["image"] +'\', title: \'Pre-Processed Image\'})">View</a></b>, <b>Score:</b> '+pipeline_status_data[key]["score"]+'</label>';
                } else {
                    html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;"><b>Model:</b> '+key+', <b>Result:</b> '+result+', <b>Score:</b> '+pipeline_status_data[key]["score"]+'</label>';
                }
            }else{
                let d = pipeline_status_data[key];
                if(Array.isArray(pipeline_status_data[key])){
                    d = '<a href="#!" onclick="alert(\''+JSON.stringify(d)+'\')">View</a>';
                }
                html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;"><b>Model:</b> '+key+', <b>Result:</b> '+d+'</label>';
            }
        })
    }else{
        html = html + '<hr style="margin: 0.5rem 0;border-top: 1px solid rgba(0, 0, 0, 0.24);"/><label class="swal2-label" style="font-weight: 400;">No Status Data to Show</label>'
    }

    Swal.fire({
        title: 'Lat,Long: '+latlng,
        html: html,
    })
}

function idleDetect() {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer; 
    window.onclick = resetTimer;
    window.onkeypress = resetTimer;   
    window.addEventListener('scroll', resetTimer, true);

    function idleSite() {
        if($("#idle-overlay").length > 0){
            $("#idle-overlay").remove();
        }

        var idleOverlay = '<div id="idle-overlay" tabindex="1" class="idle-overlay"><b>Click To Continue</b></div>';
        $('body').append(idleOverlay);
        $('body').css("overflow","hidden");
        $("#idle-overlay").focus()
        $('.wrapper').css('filter', 'blur(3px)')

        $("#idle-overlay").on("click", function(){
            $("#idle-overlay").fadeOut();
            $('body').css("overflow","initial");
            $('.wrapper').css('filter', 'unset')
        })
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(idleSite, 600000); // 10 min
    }
}
idleDetect();

// Open-source
console.log("%cHey, we are open-source on GitHub. Feel free to Contribute there.", "background: #111; color: wheat; font-size: x-large");
console.log("%chttps://github.com/ISAC-SIMO/", "font-size: large");