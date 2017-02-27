(function(){
	displayWebsiteDivider();
})();

////// Instantiating global objects ///////////////// 
var catList = new CategoryList();
//>>>>>>>>>> The end of object instantiation <<<<<<<<//


////// Object Initialisations /////////////
var currentCategory = {
	category : null
}
//>>>>>>> End of Object Initialisation <<<<<<<<<<//


////// Adding event listeners to elements ////////////
var btnCat = document.getElementById("btnAddCategory");
btnCat.addEventListener("click",catList.addCategory);

var delBtn = document.querySelectorAll(".deleteCategory");
for(var i = 0; i < delBtn.length; i++){
	delBtn[i].addEventListener("click",function(){
		catList.removeCategory(this)},false);	
}

var catElem = document.querySelectorAll(".categoryTitle");
for(var i = 0; i < catElem.length; i++){
	catElem[i].addEventListener("click",function(){
		catList.displayWebsites(this)},false);	
}

var btnAddWebsite = document.getElementById("btnAddWebsite");
btnAddWebsite.addEventListener("click",function() { 
if(currentCategory.category) {
	currentCategory.category.addWebsite();
} else { 
	alert("You need to first select a Category on the left/top or create one if there isn't any");
}},false);

//>>>>>>>>>>>> The end of addEventlisteners  <<<<<<<<<<<//



////// General functions (aka utility functions) ////////

/*
* Function to display an hr element as a divider between list of websites and form elements if
*  there are more than 1 li elements(website item) or else hide the hr element
*/
function displayWebsiteDivider() {
	
	var elems = document.querySelector("#websiteContainer").childNodes;
	var num = 0;
	for(var i = 0; i < elems.length; i++){
		if(elems[i].nodeType === 1) {
			num += 1;
		}
	}
	if(num > 0){
		document.getElementById("websiteDivider").style.display = "block";
	} else {
		document.getElementById("websiteDivider").style.display = "none";
	}
	
}

/*
* Function to display an hr element as a divider between list of categories and form elements if
*  there are more than 1 li elements(category item) or else hide the hr element
*/
function displayDivider() {
	
	var elems = document.querySelector("#categoryContainer").childNodes;
	var num = 0;
	for(var i = 0; i < elems.length; i++){
		if(elems[i].nodeType === 1) {
			num += 1;
		}
	}
	if(num > 0){
		document.getElementById("categoryDivider").style.display = "block";
	} else {
		document.getElementById("categoryDivider").style.display = "none";
	}
	
}

/*
* Function to create a li element to hold a category of websites
*  
*/
function createCategoryElement(title) {
	var btn = document.createElement("button");
	btn.setAttribute("class","pull-right btnDelete glyphicon glyphicon-trash");
	btn.addEventListener("click",function(){removeCategory(this)},false);
	
	var li = document.createElement("li");
	var node = document.createTextNode(title);
	li.setAttribute("class","list-group-item categoryTitle")
	li.appendChild(node);
	li.appendChild(btn);
	li.addEventListener("click",function(){catList.displayWebsites(this)},false);
	var ul = document.getElementById("categoryContainer");
	li.classList.add("fadeIn");
	ul.appendChild(li);
}

/*
* Function to create a li element to hold a website
*  
*/
function createWebsiteElement(name, url) {
	var ul = document.getElementById("websiteContainer");

	var btn = document.createElement("button");
	btn.setAttribute("class","pull-right btnDelete glyphicon glyphicon-trash");

	var text = document.createTextNode(name);

	var li = document.createElement("li");
	li.setAttribute("class", "list-group-item ");
	li.appendChild(text);
	li.appendChild(btn);
	li.setAttribute("onclick","window.open('http://" + url +"','_blank')");
	li.classList.add("fadeIn");
	ul.appendChild(li);
	displayWebsiteDivider();
	
}

/*
* Function to delete all website li elements
*  
*/
function deleteAllWebsites() {
	document.getElementById("websitesCategory").innerHTML = "Websites";
	document.getElementById("webMainContainer").removeChild(document.getElementById("websiteContainer"));

	var ul = document.createElement("ul");
	ul.setAttribute("id", "websiteContainer");
	ul.setAttribute("class", "list-group");
	document.getElementById("webMainContainer").appendChild(ul);
	document.getElementById("nameWebsite").style.borderColor = "#FFF";
	document.getElementById("urlWebsite").style.borderColor = "#FFF";	
	displayWebsiteDivider();
}

/*
* Function to display a list of websites that belong to the selected category
*  
*/
function displayWebsitesOnCategorySelect(websites) {
	deleteAllWebsites();

	if(websites.length == 0) return;

	for(let i = 0; i<websites.length; i++){
		createWebsiteElement(websites[i].name,websites[i].url);
	}
}

var outerVariables = {
 counter : 0,
 currElem: ""
}

function changeBackground(elem) {
	
	if(outerVariables.counter === 0) {
		outerVariables.currElem = elem;
		elem.classList.add("changeBackground");
		outerVariables.counter += 1;
	} else {
		outerVariables.currElem.classList.remove("changeBackground");
		outerVariables.currElem = elem;
		elem.classList.add("changeBackground");
	}
}

/*
* Function to check if input fields are valid before proceeding to the next process
*  
*/
function websiteInputIsEmpty() {
	var webUrl = document.getElementById("urlWebsite").value;
	var webName = document.getElementById("nameWebsite").value;
	if((webUrl.trim() === "") || (webName.trim() === "")) {
		return true;
	}
	return false;
}
//>>>>>>>>>>>>> The end of general functions <<<<<<<<<<<<<//


////// The Category class definition and methods ////////////
function Category(title) {
	this.title = title;
	this.websites = [];
	this.getTitle = function() {
		return this.title;
	};
}

Category.prototype.addWebsite = function () {
	if(document.getElementById("websitesCategory").innerHTML === "Websites") {
		alert("You need to first select a Category on the left/top or create one if there is no one");
	} else {
		if(websiteInputIsEmpty()) {
			document.getElementById("nameWebsite").style.borderColor = "#F00";
			document.getElementById("urlWebsite").style.borderColor = "#F00";
		} else {
			var name = document.getElementById("nameWebsite");
			var url = document.getElementById("urlWebsite");
			var newWebsite = new Website(name.value,url.value); 
			this.websites.push(newWebsite);
			console.log(name.value,' - ', url.value);
			createWebsiteElement(name.value,url.value);
			name.value = ""; name.style.borderColor = "#FFF";
			url.value = ""; url.style.borderColor = "#FFF";
		}
	}
}

Category.prototype.removeWebsite = function () {
	//
}
// >>>>>>>>>>> The end of Category class definition <<<<<<<<//


////// The CategoryList Class definition and methods /////////
function CategoryList() {
	this.categories = [];
	this.addCategory = addCategory;
	this.removeCategory = removeCategory;
	this.displayWebsites = displayWebsites;
}



function addCategory() {

	var title = document.getElementById("categoryToAdd").value;

	if(title.trim() !== ""){
		var newCategory = new Category(title);
		catList.categories.push(newCategory);
		document.getElementById("categoryToAdd").value = "";
		createCategoryElement(title);
	} else {
		document.getElementById("categoryToAdd").value = "";
		alert("Please enter something");
	}
	displayDivider();
} 

function removeCategory(bin) {
	
	var categoryElements = document.getElementById("categoryContainer").childNodes;
	var arr = [];
	var node = bin.parentNode;
	for(var i = 0; i < categoryElements.length; i++) {
		if(categoryElements[i].nodeType == 1) {
			arr.push(categoryElements[i]);
		}
	}
	var categoryToDelTitle = catList.categories[arr.indexOf(node)].title;
	var currentViewedCategoryTitle = document.getElementById("websitesCategory").innerHTML;
	catList.categories.splice(arr.indexOf(node),1);
	console.log(node.parentNode);
	document.getElementById("categoryContainer").removeChild(node);
	displayDivider();
	if(currentViewedCategoryTitle === categoryToDelTitle){
		deleteAllWebsites();
	}
}

function displayWebsites(catToShow) {
	
	var par = document.getElementById("categoryContainer").childNodes;
	var arr = [];
	for(var i = 0; i < par.length; i++) {
		if(par[i].nodeType == 1) {
			arr.push(par[i]);
		}
	}
	var target = document.getElementById("websitesCategory");
	var index = arr.indexOf(catToShow);
	// return if the current object is destroyed
	if(!(catList.categories[index])){
		currentCategory.category = null;
		return;
	}
	displayWebsitesOnCategorySelect(catList.categories[index].websites);
	target.innerHTML = catList.categories[index].getTitle();
	currentCategory.category = catList.categories[index];

	changeBackground(catToShow);
}
// >>>>>>>>>>> The end of CategoryList class definition <<<<<<<<//


////// The Website Class definition and methods if any /////////
function Website(name, url) {
	this.name = name;
	this.url = url;
}
//>>>>>>>>>>>> The end of Website Class definition <<<<<<<<<<//