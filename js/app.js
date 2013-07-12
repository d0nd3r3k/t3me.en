(function(){
var homePage = document.getElementById("wrapper"),
articlePage = document.getElementById("articlePage"),
currentPage = homePage;
    
function slidePageFrom(page, from) {
	// Position the page at the starting position of the animation
	page.className = "page " + from;
	// Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
	page.className ="page transition center";
	currentPage.className = "page transition " + (from === "left" ? "right" : "left");
	currentPage = page;
}

var myScroll,
	pullDownEl, pullDownOffset;
function getData(){
	$.getJSON('http://zeinaapp.com:3000/rss/en', function(data) {
		
		$.each(data[0].articles, function(i, article) {
			  	console.log(article);

				var articleData = {
					articleTitle: article.title,
					articleImage: article.image,
					articleCategory: article.categories[0],
					articlePubDate: $.format.date(new Date(article.pubDate), 'dd/MM/yyyy'),
					articleType: article.type,
					articleDesc: article.summary,
					articleText: article.description,
					articleAuthor: article.author
				};
				var template = $('#articleTpl').html();
				var html = Mustache.to_html(template, articleData);
				$('ul.articles').append(html);	
		});
		
		myScroll.refresh();	
	});
}

function pullDownAction () {
		getData();
}

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	
	

	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} 
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownAction();	// Execute custom function (ajax call?)
			}
		}
	});

	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
function isTouchDevice(){
	try{
		document.createEvent("TouchEvent");
		return true;
	}catch(e){
		return false;
	}
}

function touchScroll(id){
	if(isTouchDevice()){ //if touch events exist...
		var el=document.getElementById(id);
		var scrollStartPos=0;

		document.getElementById(id).addEventListener("touchstart", function(event) {
			scrollStartPos=this.scrollTop+event.touches[0].pageY;
			event.preventDefault();
		},false);

		document.getElementById(id).addEventListener("touchmove", function(event) {
			this.scrollTop=scrollStartPos-event.touches[0].pageY;
			event.preventDefault();
		},false);
	}
}

$(document).ready(function(){
	  getData();
	  
	  
	 	$('#player').youTubeChannel({user:'t3medotcom'});
	  
	$("ul.articles").on('click','li',function(e){
		
		var domArticle = $.parseHTML($(this).find('.fullArticle').text());
		
		var title = $(this).find('.title').text(),
		    pubDate = $(this).find('.pubDate').text(),
			category = $(this).find('.category').text(),
			image = $(this).find('img').attr('src'),
			type = $(this).find('img').attr('class'),
			author = $(this).find('.author').text();
		
		var fullArticleData = {
			articleTitle: title,
			articleImage: image,
			articleCategory: category,
			articlePubDate: pubDate,
			articleType: type,
			articleAuthor: author
		};
		
		var template = $('#fullArticleTpl').html();
		var html = Mustache.to_html(template, fullArticleData);
		$('#articlePage').html(html);
		
		$('#fullArticlePara').html(domArticle);
		slidePageFrom(articlePage, 'right');
		touchScroll('articlePage')
		$(".backbutton").fadeIn(200);
	});
	$(".backbutton").on('click',function(e){
		slidePageFrom(homePage, 'left');
		$(".backbutton").hide();
	});
	$$("#articlePage").swipeRight(function(){
		slidePageFrom(homePage, 'left');
		$(".backbutton").hide();
	});
	$("#latest a").click(function(){
		$('li.news').show();
		$('li.features').show();
		$('li.reviews').show();
		myScroll.refresh();	
	});			
	$("#news a").click(function(){
		$('li.news').show();
		$('li.features').hide();
		$('li.reviews').hide();
		myScroll.refresh();	
	});
	$("#feature a").click(function(){
		$('li.news').hide();
		$('li.features').show();
		$('li.reviews').show();
		myScroll.refresh();	
	});
})
})();