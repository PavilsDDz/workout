var server = 'http://192.168.0.193/workout.tk/'//'http://workout.tk/'

// function show_popup(){
// 	alert('goooooo')
// }
// function ajax1(){
// 	$.support.cors=true;

// 		 $.ajax({url: server+"index.php", success: function(result){
//         $("#page3").html(result)
//         console.log(result + '1')
//     },error:function(xhr,status,error){
//     	console.log('Error')
//     }
// }); 
	
// }

/*
/////////////////////////////////////
                        registration
////////////////////////////////////
*/
var r_approve = [false,false,false,false,false,false];
var r_approved = false;

function reg(){
    if (r_approved) {

    	$.support.cors=true;

        let run = $('#r_username').val();
        let rem = $('#r_email').val();
        let rpw = $('#r_password').val();
        let rfn = $('#r_firstname').val();
        let rsn = $('#r_secondname').val();

       

        $.post( server+"index.php?reg=true", {username:run , email:rem , password:rpw , firstname:rfn , secondname:rsn})
        .done(function( data ) {
            if (data) {
                alert('all cool')
            }else{
                alert('error on registration')
            }
        })
        .fail(function() {
            alert( "error" );
        })
    }
}


function check_data(c,d){
    if ((c=='username'&&d.val().length>=3)) {
        $.ajax({url: server+"index.php?check="+c+"&val="+d.val(), success: function(result){
            let has = (result=='1'||result==1)
            console.log(result, has)
            if (has) {
             //   alert('username is taken')
                if(c=='username'){
                    $('#e_un').html('this username alredy exists')
                     let ind = d.parent().parent().index()
                     r_approve[ind] = false
                     console.log(r_approve)
                }

            }
        },error:function(xhr,status,error){
            console.log('Error')
        }});
    }
}

function r_approver(){
    if (r_approve.indexOf(false)==-1) {
        r_approved = true
    }else{
        r_approved = false
    }
    console.log(r_approved)
    console.log(r_approve)
}

var txt_len = function(input, len){

    let ind = input.parent().parent().index()

    //console.log(ind)
     text1 = input.val();
   // console.log(text1)
     if (text1.length >= len) {
         r_approve[ind] = true; 
        input.parent().siblings('.flex').children('.error').empty()
         

     }else{
         r_approve[ind] = false; 
         input.parent().siblings('.flex').children('.error').html('atleast '+len+' charecters')
         
     }

     r_approver()
}
    function validateEmail(input) {
        let email = input.val()
        let ind = input.parent().parent().index()
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(re.test(email))
        if (re.test(email)) {
            r_approve[ind] = true; 
            input.parent().siblings('.flex').children('.error').html('')

        }else{
            r_approve[ind] = false; 
            input.parent().siblings('.flex').children('.error').html('please enter valid email')

        }
        r_approver()
    }

    function match_pw (original, match){

        let ind = match.parent().parent().index()

        if (original.val()==match.val()) {
            r_approve[ind] = true
            match.parent().siblings('.flex').children('.error').html('')
        }else{
            r_approve[ind] = false
            match.parent().siblings('.flex').children('.error').html('password muts match')
        }
     r_approver()

    }




/*
/////////////////////////////////////
                     WORKOUT QUERIES
/////////////////////////////////////
*/


function get_type(that){
    $('.posts').empty()
    id = $.mobile.activePage.attr('id')

    if (that.hasClass('lvl')) {
        $('#'+id+' .lvl.active').removeClass('active')
        that.addClass('active')
    }else if(that.hasClass('zn')){
        $('#'+id+' .zn.active').removeClass('active')
        that.addClass('active')
    }

    persons = $.mobile.activePage.attr('persons')

    level=$('#'+id+' .lvl.active').attr('level')
    type=$('#'+id+' .zn.active').attr('type')

    t=""+persons+""+level+""+type

  query_videos(t,'list')
    
   

}




function query_videos (filter,i){
   
     $.ajax({url: server+"index.php?query_videos="+i+"&filter="+filter, success: function(result){
           
            //console.log(result)
            content_array = JSON.parse(result);
            //console.log(content_array)

            if (i=='list') {
                content_array.forEach(function(item){
                          $(" .posts").append(
                            '<div class="post flex"><a class="single_link" post="'+item.id+'"><div class="icon" style="background-image:url('+server+item.icon+')"></div></a><div class="info flex"><div class="favorite" fav_id="'+item.id+'"></div><a class="single_link" post="'+item.id+'"><h2>'+item.title+'</h2></a></div></div>'
                            )
                 });
            }else if (i=='single') {
                //console.log(content_array)
                $('#single .post .icon').css({'background-image':'url('+server+content_array[0].icon+')'})
                $('#single .post .info h2').text(content_array[0].title)
                $('#single .video_wrap video').attr('src',server+content_array[0].link)
           

                palyvideo(server+content_array[0].link)


            }

         

            
        },error:function(xhr,status,error){
            console.log('Error')
        }});

}






$(function(){
 $('.posts').delegate('.single_link','click',function(){
    let getid = $(this).attr('post')

    query_videos(getid,'single')
    $.mobile.changePage("#single");

 })
})



function palyvideo(video_link){

 var videoUrl = video_link;

  // Just play a video
  //window.plugins.streamingMedia.playVideo(videoUrl);

  // Play a video with callbacks
  var options = {
    successCallback: function() {
      console.log("Video was closed without error.");
    },
    errorCallback: function(errMsg) {
      console.log("Error! " + errMsg);
    },
    orientation: 'landscape',
    shouldAutoClose: true,  // true(default)/false
    controls: true // true(default)/false. Used to hide controls on fullscreen
  };
  window.plugins.streamingMedia.playVideo(videoUrl, options);
}




