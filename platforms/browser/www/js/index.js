var server = 'http://192.168.0.195/workout.tk/'//'http://workout.tk/'
var user;
var storage;


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
                            id = $.mobile.activePage.attr('id')
                  content_array.forEach(function(item){

                            $("#"+id+" .posts").append(
                              '<div class="post flex"><div><a class="single_link" link="'+item.link+'"><div class="icon" style="background-image:url('+server+"icons/"+item.link+'.jpg)" link="'+item.link+'"></div></a></div><div class="info flex"><div class="favorite" fav_id="'+item.id+'"></div><a class="single_link" post="'+item.id+'" link="'+item.link+'"><h2>'+item.title+'</h2></a></div></div>'
                              )
                   });
                  calc_pos()
               
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


function edit_favorites(a,pid){
  console.log('asdsfghj')
  $.post( server+"index.php?favorites=true", {user_id:user.id , post_id:pid, action:a})
  .done(function(data){
    if(data){
      console.log(data)
      switch(a){
        case 'add':
          break;
        case 'select':
          if(data != 0  && data != '0' && data != null){
            
            storage.setItem('favorites',data)
            fav_array = JSON.parse(storage.getItem('favorites'))
            console.log(fav_array)
          }else{
            console.log('no favorites found')
          }

      }

    }else{

    }
      
  })
  .fail(function(){
      console.log('fail')

  })
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
                storage.setItem('user', data)
                user_array = JSON.parse(storage.getItem('user'))
                user = user_array[0]
                console.log(user)
                $(".login_link").css('display','none')
                $(".profile_link").css('display','block')
                $.mobile.changePage("#ideas");
                edit_favorites('select',user.id)


                //console.log(user_array)

            }else{
                alert('wrong username or password')
            }
        })
        .fail(function() {
            alert( "error" );
        })
 }
var pos_array = []
function calc_pos(){
  pos_array = []
  id = $.mobile.activePage.attr('id')
  o1 = $('#'+id+' .posts').offset()
  for (var i = 0; i < $('.post').length-1; i++) {
     o = $('.post:eq('+i+')').offset()
     pos_array.push(o.top-o1.top)
     console.log(pos_array)
  }
}

$(function(){

   $('.post_set').click(function(){
    
    posts = document.getElementById($(this).attr('posts_field'))
    console.log(posts)
  })

  function addvideo(t,l){
    // alert(t)
       t.parent().parent().after('<div class="video_wrap" style="display:none"><video webkit-playsinline loop id="video" poster="img/video_load.jpg" ><source src="'+server+'videos/'+l+'.mp4" type="video/mp4"></video></div>')
    $('.video_wrap').slideDown(400, function(){calc_pos()})
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
    dir = 0

    stop_old = 0
    post_online = 0
    var posts //=  document.getElementById('posts')

    function calc_post_line(){
      if (dir) {
            console.log(post_online)
        for (var i = 0; i < pos_array.length; i++) {
          if (posts.scrollTop>pos_array[post_online+1]) {
            console.log(i, dir, '+',posts.scrollTop,">",pos_array[post_online+1])
            return post_online+1;
          }
        }
      }else if(!dir){
        for (var i = 0; i < pos_array.length; i++) {
          if (posts.scrollTop<pos_array[post_online]) {
            console.log(i, dir, '-',posts.scrollTop,"<",pos_array[post_online-1])
            return post_online-1;
          }
        }
      }
      return post_online;
    }




  $('.posts').scroll(function(){

    dir = stop_old>posts.scrollTop ? 0 : 1
    
    post_online = calc_post_line()//Math.floor((posts.scrollTop+$('.video_wrap').height())/post_height) + add

    if (post_online!=post_online_old) {
     
      //now = $('#posts .post:eq('+post_online+') .icon').attr('link')
      //$('#posts .post:eq('+post_online+') .icon').css('background-image','url('+server+'/gifs/'+now+'.gif)')
      //now1 = $('#posts .post:eq('+(post_online+1)+') .icon').attr('link')
      //queue.push(post_online)

      queue.unshift(post_online)

      for (var i = 0; i < 2; i++) {
        ind = queue[i]
        link = $('#'+posts.id+' .post:eq('+ind+') .icon').attr('link')
        $('#'+posts.id+' .post:eq('+ind+') .icon').css('background-image','url('+server+'/gifs/'+link+'.gif)')
        $('#'+posts.id+' .post:eq('+ind+')').css('background-color','rgba(0,0,0,0.6)')
      }
      icon = $('#'+posts.id+' .post:eq('+queue[2]+') .icon').attr('link')
      $('#'+posts.id+' .post:eq('+queue[2]+') .icon').css('background-image','url('+server+'/icons/'+icon+'.jpg)')
        $('#'+posts.id+' .post:eq('+queue[2]+')').css('background-color','rgba(0,0,0,0)')
    
      //console.log(queue)
      queue.splice(-1,1)
      post_online_old = post_online
    
    } 

      stop_old = posts.scrollTop

  })




 $('.posts').delegate('.favorite','click',function(){
    edit_favorites('add',$(this).attr('fav_id'))
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

  storage = window.localStorage;
  //storage.setItem('user', '')
  //storage.setItem('name', 'my name') // Pass a key name and its value to add or update that key.
  //storage.removeItem(key) // Pass a key name to remove that key from storage.
 // var value = storage.getItem('name'); // Pass a key name to get its value.
 // console.log(value)

  user_loc = JSON.parse(storage.getItem('user'))

  console.log(user_loc)

  if(user_loc != 'undefined' && user_loc != null){

    $.mobile.changePage("#ideas");
    user = user_loc[0]

    $(".login_link").css('display','none')
    $(".profile_link").css('display','block')

    edit_favorites('select',0)


  }


// POST SCROLLER
 
// PROFILE CALL
 $(".profile_link").click(function(){
  $('.user_stuff').animate({'left':'0'},300)
 })
//PAGE SETUP
  $('.logout').click(function(){
    storage.setItem('user','')
    user = null
    $.mobile.changePage('#login')
    $('.user_stuff').css('left','100%')
  })

}