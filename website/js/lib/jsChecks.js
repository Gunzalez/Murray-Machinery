document.getElementsByTagName("HTML")[0].className = ((document.getElementsByTagName("HTML")[0].className) ? document.getElementsByTagName("HTML")[0].className + ' js-enabled' : 'js');

if(Modernizr.touch){
    document.getElementsByTagName('html')[0].className += " mobile";
} else {
    document.getElementsByTagName('html')[0].className += " desktop";
}