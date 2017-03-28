function getGiphy() {
  var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=happiness&rating=pg",false);
    xhr.send();

  if(xhr.status == 200)
  {
    var jsObj = JSON.parse(xhr.responseText);
    var image = jsObj.data.fixed_height_downsampled_url;
    document.getElementById("giphy-main").innerHTML = '<div id="giphy-module"><img src='+ image +' alt="happiness"></div>';
  }

}