$(document).ready(function() {
	$(".button-collapse").sideNav();
	$('select').material_select();

	$("#searchButton").click(function(event) {
		event.preventDefault();
		var recipe = $("#recipeTextbox").val();
		var ingredients = $("#ingredientsTextbox").val();
		var ingredientList = "";
		for (var i = 0; i < ingredients.length; i++) {
			if (ingredients.charAt(i).match(/\s+/g))
				ingredientList += ",";
			else
				ingredientList += ingredients.charAt(i);
		}
		console.log(recipe);
		console.log(ingredientList);

		var myUrl = "";
		if (recipe !== "" && ingredientList !== "") {
			myUrl =  "http://www.recipepuppy.com/api/?i=" + ingredientList +
			"&q=" + recipe;
		}
		else if (recipe === "" && ingredientList !== "") {
			myUrl =  "http://www.recipepuppy.com/api/?i=" + ingredientList;
		}
		else if (recipe !== "" && ingredientList === "") {
			myUrl =  "http://www.recipepuppy.com/api/?q=" + recipe;
		}

		$.ajax({
			url : myUrl,
			dataType : "json",
			crossDomain : true,
			success : function(json) {
				console.log(json);
				results = "";
				for (var i = 0; i < json.results.length; i++) {
					results += "<div class=\"card medium light-blue lighten-4\">";
					results += "<div class=\"card-image waves-effect waves-block waves-light\">";
					if (json.results[i].thumbnail !== "") {
						results += "<img class=\"activator\" src=" + json.results[i].thumbnail + ">";
					}
					else {
						results += "<img class=\"activator\" src=" + "/images/no_image_available.png" + ">";
					}
					results += "</div>";
					results += "<div class=\"card-content\">";
					results += "<span class=\"card-title activator grey-text text-darken-4\">" + json.results[i].title + 
						"<i class=\"material-icons right\">more_vert</i></span>";
					results += "<p><a target=\"_blank\" href=" + json.results[i].href + ">" + "Full Recipe</a></p>";
					results += "</div>";
					results += "<div class=\"card-reveal\">";
					results += "<span class=\"card-title grey-text text-darken-4\">" + json.results[i].title + 
						"<i class=\"material-icons right\">close</i></span>";
					results += "<ol>";
					var list = json.results[i].ingredients;
					var word = "";
					for (var j = 0; j < list.length; j++) {
						if (list[j] === ",") {
							results += "<li>" + word + "</li>";
							if (j + 1 !== list.length - 1)
								j++;
							word = "";
						}
						else
							word += list[j];
					}
					results += "</ol></div></div>";
				}
				if (json.results.length == 0)
					results = "<h4>Sorry, no results were found!</h4>";
				$(".results").html(results);
				$(".card").addClass("cardWidth");
				$(".results").addClass("container");
			},
			error : function() {
				$(".results").html("<h4>Sorry, no results were found!</h4>");
			}
		});
	})
	$("#restaurantSearch").click(function(event) {
		event.preventDefault();
		var keywordsInput = $("#keywordsTextbox").val();
		var category = $("#categoryDropdown").val();
		var order = $("#orderDropdown").val();

		console.log(keywordsInput);
		console.log(category);
		console.log(order);

		var keywords = "";
		for (var i = 0; i < keywordsInput.length; i++) {
			if (keywordsInput.charAt(i).match(/\s+/g))
				keywords += "%20";
			else
				keywords += keywordsInput.charAt(i);
		}

		var restaurantUrl = "";
		if (category === null && order !== null) {
			restaurantUrl = "https://developers.zomato.com/api/v2.1/search?q=" + keywords + "&order=" + order;
		}
		else if (category !== null && order !== null) {
			restaurantUrl =  "https://developers.zomato.com/api/v2.1/search?q=" + keywords + "&sort=" + category +
				"&order=" + order;
		}
		else {
			restaurantUrl = "https://developers.zomato.com/api/v2.1/search?q=" + keywords;
		}

		$.ajax({
			url : restaurantUrl,
			dataType : "json",
			beforeSend : function(h) {
				h.setRequestHeader("user-key", "9902233d1774bef00e55a0af97e04c99");
			},
			success : function(json) {
				console.log(json);
				results = "";
				for (var i = 0; i < json.restaurants.length; i++) {
					results += "<div class=\"card medium light-blue lighten-4\">";
					results += "<div class=\"card-image waves-effect waves-block waves-light\">";
					if (json.restaurants[i].restaurant.thumb !== "") {
						results += "<img class=\"activator\" src=" + json.restaurants[i].restaurant.thumb + ">";
					}
					else {
						results += "<img class=\"activator\" src=" + "/images/no_image_available.png" + ">";
					}
					results += "</div>";
					results += "<div class=\"card-content\">";
					results += "<span class=\"card-title activator grey-text text-darken-4\">" + json.restaurants[i].restaurant.name + 
						"<i class=\"material-icons right\">more_vert</i></span>";
					results += "<p style=\"color: #2e7d32\">" + json.restaurants[i].restaurant.location.address + "</p>";
					results += "</div>";
					results += "<div class=\"card-reveal\">";
					results += "<span class=\"card-title grey-text text-darken-4\">" + json.restaurants[i].restaurant.name + 
						"<i class=\"material-icons right\">close</i></span>";
					results += "<ol>";
					results += "<li> Cuisines: " + json.restaurants[i].restaurant.cuisines + "</li>";
					var price = json.restaurants[i].restaurant.average_cost_for_two;
					if (price != 0) {
						results += "<li>Average cost for two: " + json.restaurants[i].restaurant.currency + 
							price + "</li>";
					}
					else
						results += "<li>Average cost for two: no info</li>";
					var color = json.restaurants[i].restaurant.user_rating.rating_color;
					results += "<li><span style=\"color: #" + color + ";\">Rating: " + 
						json.restaurants[i].restaurant.user_rating.aggregate_rating + " " + 
						json.restaurants[i].restaurant.user_rating.rating_text + "</span></li>";
					results += "<li><a target=\"_blank\" href=" + json.restaurants[i].restaurant.menu_url + ">Menu</a></li>";
					results += "<li><a target=\"_blank\" href=" + json.restaurants[i].restaurant.photos_url + ">Photos</a></li>";
					results += "<li>" + "<a target\"_blank\" href=" + json.restaurants[i].restaurant.url + ">Website</a></li>";
					results += "</ol></div></div>";
				}
				if (json.restaurants.length == 0)
					results = "<h4>Sorry, no results were found!</h4>";
				$(".results").html(results);
				$(".card").addClass("cardWidth");
				$(".results").addClass("container");
			},
			error : function() {
				$(".results").html("<h4>Sorry, no results were found!</h4>");
			}
		});
	})
})





