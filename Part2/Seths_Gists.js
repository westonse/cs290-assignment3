var settings = null;
var gitResponse = "";
 
function createFavorite(ul) {
  for (var i = ul.childNodes.length - 1; i > 1; i--) {
    ul.removeChild(ul.childNodes[i]);
  }
   if(settings.Favorites.length!=0){
	settings.Favorites.forEach(function(favorite) {
        var a = document.createElement('a');
		var linkText = document.createTextNode(favorite.description);
		a.appendChild(linkText);
        a.title = "Description";
		a.href = favorite.html_url;
	    var removeButton = document.createElement('input');
		removeButton.type = "button";
		removeButton.value = "Remove";
		removeButton.id = favorite.html_url;
		removeButton.onclick = function(sender){
			removeFavorite(sender.target.id);
			a.remove();
			removeButton.remove();
		};
        ul.appendChild(a);
		ul.appendChild(removeButton);
	});
  }
}
function getGists(){
  var req = new XMLHttpRequest();
  if(!req){
    throw 'Unable to create HttpRequest.';
  }
  var url = 'https://api.github.com/gists';
  req.onreadystatechange = function(){
    if(this.readyState === 4){
      gitResponse = JSON.parse(this.responseText);
      createFavorite(document.getElementById('Favorites'));
    }
  };
  req.open('GET', url);
  req.send();
}

function urlStringify(obj){
  var str = []
  for(var prop in obj){
    var s = encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]);
    str.push(s);
  }
  return str.join('&');
}
function removeFavorite(html_url){
			var j;
			var removeIndex;
			for(j=0; j<settings.Favorites.length; j++){
				if(settings.Favorites[j].html_url == html_url){
					removeIndex = j;
				}
			}
			settings.Favorites.splice(removeIndex,1);
			localStorage.setItem('Favorites',JSON.stringify(settings));
}

function addToFavorites(ul,favorite){
		settings.Favorites.push(favorite);
		localStorage.setItem('Favorites', JSON.stringify(settings));
        var a = document.createElement('a');
		var linkText = document.createTextNode(favorite.description);
		a.appendChild(linkText);
        a.title = "Description";
		a.href = favorite.html_url;
	    var removeButton = document.createElement('input');
		removeButton.type = "button";
		removeButton.value = "Remove";
		removeButton.name = favorite.html_url;
		removeButton.onclick = function(sender){
			removeFavorite(sender.target.name);
			a.remove();
			removeButton.remove();
		};
		var breakline = document.createElement('br');
		ul.appendChild(a);
		ul.appendChild(removeButton);
		ul.appendChild(breakline);
}
function Favorite(description,html_url){
	this.description = description;
	this.html_url = html_url;
}

function displayGists(){
	gistDisplay = gitResponse;
	var i;
	var results = document.getElementById('Results');
	var numPages = document.getElementById("numPages").value;
	var numToDisplay = numPages * 30;
	for(i=0; i<numToDisplay; i++){
     var a = document.createElement('a');
	 var linkText = document.createTextNode("No Description");
	 if(gistDisplay[i].description!="" && gistDisplay[i].description!=null){
		linkText = document.createTextNode(gistDisplay[i].description);
	 }
     a.appendChild(linkText);
     a.title = "Description";
	 if(gistDisplay[i].html_url!=null){
	 a.href = gistDisplay[i].html_url;
	 }
	 var addButton = document.createElement('input');
	 addButton.type = "button";
	 addButton.value = "add"
	 addButton.id = gistDisplay[i].description;
	 addButton.name = gistDisplay[i].html_url;
	 var k;
	 var inFavorites = false;
	 for(k=0; k<settings.Favorites.length; k++){
		if(gistDisplay[i].description == settings.Favorites[k].description){
			inFavorites = true;
		}
	 }
	 if(!inFavorites){
	 var breakline = document.createElement('br');
	 results.appendChild(a);
	 results.appendChild(addButton);
	 results.appendChild(breakline);
	 }
	 addButton.onclick = function(sender){
		var j;
		var els = document.getElementsByTagName("a");
		for(j=0; j<els.length; j++){
			if(els[j].href == sender.target.name){
				var linkRemove = els[j];
			}
		}
		var newFavorite = new Favorite(sender.target.id,sender.target.name);
		addToFavorites(document.getElementById('Favorites'),newFavorite);
		sender.target.remove();
		linkRemove.remove();
	 }
	}

}
window.onload = function() {
  var settingsStr = localStorage.getItem('Favorites');
  if( settingsStr === null ) {
    settings = {'Favorites':[]};
    localStorage.setItem('Favorites', JSON.stringify(settings));
  }
  else {
    settings = JSON.parse(localStorage.getItem('Favorites'));
  }
  getGists();
};