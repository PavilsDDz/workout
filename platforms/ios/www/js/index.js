var server = 'http://192.168.0.196/workout.tk/'//'http://workout.tk/'
var user;


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
  // alert(filter)
   
     $.ajax({url: server+"index.php?query_videos="+i+"&filter="+filter, success: function(result){
           
            //console.log(result)
            var content_array

            if (result!=null&&result!='') {
              content_array = JSON.parse(result);
            console.log(content_array)

              if (i=='list') {
                  content_array.forEach(function(item){
                            $(" .posts").append(
                              '<div class="post flex"><div><a class="single_link" link="'+item.link+'"><div class="icon" style="background-image:url('+server+"icons/"+item.link+'.jpg)" link="'+item.link+'"></div></a></div><div class="info flex"><div class="favorite" fav_id="'+item.id+'"></div><a class="single_link" post="'+item.id+'" link="'+item.link+'"><h2>'+item.title+'</h2></a></div></div>'
                              )
                   });
               
              }else if (i=='single') {
                  //console.log(content_array)
                  $('#single .post .icon').css({'background-image':'url('+server+content_array[0].icon+')'})
                  $('#single .post .info h2').text(content_array[0].title)
                  $('#single .video_wrap video source').attr('src',server+content_array[0].link)
                  document.getElementById('video').load()
                  document.getElementById('video').play()

                 // palyvideo(server+content_array[0].link)


              }
            }else{
              if (i=='list') {
                 $(" .posts").append("<h3>no workouts found</h3>" )
              }
            }

         

            
        },error:function(xhr,status,error){
            console.log('Error')
        }});
}

// document.getElementById('login_btn').onclick = function(){login()}

// function login(){
//   username = document.getElementById('user_input').value()
//   password = document.getElementById('pw_input').value()

//   console.log(username,password)

// }

 function login(u,p){
     $.post( server+"index.php?login=true", {username:u , password:p})
        .done(function( data ) {
            if (data) {
                console.log(data)
            }else{
                alert('wrong username or password')
            }
        })
        .fail(function() {
            alert( "error" );
        })
 }


$(function(){
  function addvideo(t,l){
    // alert(t)
       t.parent().parent().after('<div class="video_wrap" style="display:none"><video webkit-playsinline loop id="video" poster="img/video_load.jpg" ><source src="'+server+'videos/'+l+'.mp4" type="video/mp4"></video></div>')
    $('.video_wrap').slideDown()
      var vid = document.getElementById("video"); 
      console.log(t.parent().parent())
      vid.play()
    }


 $('.posts').delegate('a','click',function(){
    let link = $(this).attr('link')

    

      console.log($('.video_wrap').length)
   if (!$('.video_wrap').length) {
      addvideo($(this),link)
   }else{
      single = $(this)
      $('.video_wrap').slideUp(400,function(){
        $('.video_wrap').remove()
         addvideo(single,link)
        
      })
    
   }
    
  




    //query_videos(getid,'single')
    //$.mobile.changePage("#single");



 })



 $('#login_btn').click(function(){
  username = document.getElementById('user_input').value
  password = document.getElementById('pw_input').value
  login(username,password)
  console.log(username,password)


 })

    post_height = (window.innerWidth /100) * 20 // post height = 20vw
post_online_old = 0
    queue = [0,1]

    posts =  document.getElementById('posts')
  $('.posts').scroll(function(){

  
    
    post_online = Math.floor((posts.scrollTop)/post_height)

    if (post_online!=post_online_old) {
     
      //now = $('#posts .post:eq('+post_online+') .icon').attr('link')
      //$('#posts .post:eq('+post_online+') .icon').css('background-image','url('+server+'/gifs/'+now+'.gif)')
      //now1 = $('#posts .post:eq('+(post_online+1)+') .icon').attr('link')
      //queue.push(post_online)
      queue.unshift(post_online)
      for (var i = 0; i < 2; i++) {
        ind = queue[i]
        link = $('#posts .post:eq('+ind+') .icon').attr('link')
        $('#posts .post:eq('+ind+') .icon').css('background-image','url('+server+'/gifs/'+link+'.gif)')
        $('#posts .post:eq('+ind+')').css('background-color','rgba(0,0,0,0.6)')
      }
      icon = $('#posts .post:eq('+queue[2]+') .icon').attr('link')
      $('#posts .post:eq('+queue[2]+') .icon').css('background-image','url('+server+'/icons/'+icon+'.jpg)')
        $('#posts .post:eq('+queue[2]+')').css('background-color','rgba(0,0,0,0)')


      queue.splice(-1,1)
      console.log(queue)
      post_online_old = post_online

    } 

  })

})


/*
//
    DEVICE REDY
//
*/


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {



// STORAGE AND USER DEFINE 

  var storage = window.localStorage;
  //storage.setItem('name', 'my name') // Pass a key name and its value to add or update that key.
  //storage.removeItem(key) // Pass a key name to remove that key from storage.
  var value = storage.getItem('name'); // Pass a key name to get its value.
  console.log(value)
  user = storage.getItem('user')
  console.log(user)
  if(user != 'undefined'&& user != null){
    $.mobile.changePage("#ideas");
  }

// POST SCROLLER
 

}