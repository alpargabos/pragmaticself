$(document).foundation();

$('ul[class="menu"] li a div[id="top-menu"]').click(function(){
    $('ul[class="menu"] li a div[id="top-menu"]').removeClass( "active" );
    $(this).addClass("active");
});

$('ul li[id="sub-nav-menu"]').click(function(){
    $('ul li[id="sub-nav-menu"]').removeClass( "active" );
    $(this).addClass("active");
});

$(document).ready(function(){
            var submitIcon = $('.searchbox-icon');
            var inputBox = $('.searchbox-input');
            var searchBox = $('.searchbox');
            var isOpen = false;
            submitIcon.click(function(){
                if(isOpen == false){
                    searchBox.addClass('searchbox-open');
                    $('ul[class="menu"] li[class="container"]').width(350);
                    inputBox.focus();
                    isOpen = true;
                } else {
                    searchBox.removeClass('searchbox-open');
                    $('ul[class="menu"] li[class="container"]').width(40);
                    inputBox.focusout();
                    isOpen = false;
                }
            });
             submitIcon.mouseup(function(){
                    return false;
                });
            searchBox.mouseup(function(){
                    return false;
                });
            $(document).mouseup(function(){
                    if(isOpen == true){
                        $('.searchbox-icon').css('display','block');
                        submitIcon.click();
                    }
                });
        });
            function buttonUp(){
                var inputVal = $('.searchbox-input').val();
                inputVal = $.trim(inputVal).length;
                if( inputVal !== 0){
                    $('.searchbox-icon').css('display','none');
                } else {
                    $('.searchbox-input').val('');
                    $('.searchbox-icon').css('display','block');
                }
            }
